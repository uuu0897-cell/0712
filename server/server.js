import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const NEXON_API_KEY = String(process.env.NEXON_API_KEY || "").trim();
const NEXON_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const ALLOWED_ORIGINS = String(
  process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;

  try {
    const normalizedOrigin = new URL(origin).origin.replace(/\/+$/, "");
    return ALLOWED_ORIGINS.includes(normalizedOrigin);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

if (!NEXON_API_KEY) {
  console.error("NEXON_API_KEY is missing.");
} else {
  console.log("NEXON_API_KEY loaded.");
}

const nexonApi = axios.create({
  baseURL: NEXON_BASE_URL,
  timeout: 10000,
  headers: {
    "x-nxopen-api-key": NEXON_API_KEY,
    Accept: "application/json",
  },
  paramsSerializer: {
    serialize: (params) => new URLSearchParams(params).toString(),
  },
});

function getCharacterName(req) {
  return String(
    req.query.characterName ||
      req.query.character_name ||
      req.query.name ||
      ""
  ).trim();
}

function parseAllowedMapleStoryIoUrl(rawUrl) {
  const parsedUrl = new URL(String(rawUrl || ""));
  const allowedHosts = ["maplestory.io", "labs.maplestory.io"];

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Only HTTPS URLs are allowed.");
  }

  if (!allowedHosts.includes(parsedUrl.hostname)) {
    throw new Error("URL host is not allowed.");
  }

  return parsedUrl;
}

function collectCharacterNames(value, names = new Set()) {
  if (!value || typeof value !== "object") return names;

  if (Array.isArray(value)) {
    value.forEach((item) => collectCharacterNames(item, names));
    return names;
  }

  for (const [key, item] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();

    if (
      typeof item === "string" &&
      normalizedKey.includes("name") &&
      !normalizedKey.includes("world") &&
      !normalizedKey.includes("class")
    ) {
      names.add(item.trim());
      continue;
    }

    collectCharacterNames(item, names);
  }

  return names;
}

function handleNexonError(error, res, label) {
  const status = error.response?.status || 500;
  const data = error.response?.data || null;
  const upstreamMessage =
    data?.message || data?.error?.message || (typeof data === "string" ? data : null);
  const userMessage =
    status >= 500
      ? `${label} 중 일시적인 응답 오류가 발생했습니다. ${
          upstreamMessage || "잠시 후 다시 시도해주세요."
        }`
      : upstreamMessage || `${label} failed`;

  console.error(`\n[${label}] failed`);
  console.error("HTTP Status:", status);
  console.error("Nexon Error Data:", data || error.message);
  console.error("Request BaseURL:", error.config?.baseURL);
  console.error("Request URL:", error.config?.url);
  console.error("Request Params:", error.config?.params);

  return res.status(status).json({
    success: false,
    message: `${label} failed`,
    userMessage,
    status,
    detail: data || error.message,
  });
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Maple Avatar Server is running",
    baseUrl: NEXON_BASE_URL,
    hasApiKey: Boolean(NEXON_API_KEY),
  });
});

app.get("/api/maple/ocid", async (req, res) => {
  try {
    const characterName = getCharacterName(req);

    if (!characterName) {
      return res.status(400).json({
        success: false,
        message: "characterName is required.",
        example: "/api/maple/ocid?characterName=character",
      });
    }

    const response = await nexonApi.get("/id", {
      params: {
        character_name: characterName,
      },
    });

    res.json({
      success: true,
      characterName,
      ...response.data,
    });
  } catch (error) {
    return handleNexonError(error, res, "OCID lookup");
  }
});

app.get("/api/maple/basic", async (req, res) => {
  try {
    const ocid = String(req.query.ocid || "").trim();

    if (!ocid) {
      return res.status(400).json({
        success: false,
        message: "ocid is required.",
      });
    }

    const response = await nexonApi.get("/character/basic", {
      params: {
        ocid,
      },
    });

    res.json({
      success: true,
      ...response.data,
    });
  } catch (error) {
    return handleNexonError(error, res, "Character basic lookup");
  }
});

app.get("/api/maple/character", async (req, res) => {
  try {
    const characterName = getCharacterName(req);

    if (!characterName) {
      return res.status(400).json({
        success: false,
        message: "characterName is required.",
        example: "/api/maple/character?characterName=character",
      });
    }

    const ocidResponse = await nexonApi.get("/id", {
      params: {
        character_name: characterName,
      },
    });

    const ocid = ocidResponse.data.ocid;

    const basicResponse = await nexonApi.get("/character/basic", {
      params: {
        ocid,
      },
    });

    res.json({
      success: true,
      ocid,
      ...basicResponse.data,
    });
  } catch (error) {
    return handleNexonError(error, res, "Character lookup");
  }
});

app.get("/api/maple/union-champion", async (req, res) => {
  try {
    const characterName = getCharacterName(req);

    if (!characterName) {
      return res.status(400).json({
        success: false,
        message: "characterName is required.",
        example: "/api/maple/union-champion?characterName=character",
      });
    }

    const ocidResponse = await nexonApi.get("/id", {
      params: {
        character_name: characterName,
      },
    });

    const unionResponse = await nexonApi.get("/user/union-champion", {
      params: {
        ocid: ocidResponse.data.ocid,
      },
    });

    const championNames = [...collectCharacterNames(unionResponse.data)]
      .filter(Boolean)
      .filter((name) => name !== characterName)
      .slice(0, 6);

    if (championNames.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Union champion names were not found in the Nexon response.",
        champions: unionResponse.data,
      });
    }

    const characters = await Promise.all(
      championNames.map(async (name) => {
        const championOcidResponse = await nexonApi.get("/id", {
          params: {
            character_name: name,
          },
        });

        const basicResponse = await nexonApi.get("/character/basic", {
          params: {
            ocid: championOcidResponse.data.ocid,
          },
        });

        return {
          success: true,
          ocid: championOcidResponse.data.ocid,
          ...basicResponse.data,
        };
      })
    );

    res.json({
      success: true,
      characterName,
      champions: unionResponse.data,
      characters,
    });
  } catch (error) {
    return handleNexonError(error, res, "Union champion lookup");
  }
});

app.get("/api/msio/image-proxy", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "url query parameter is required.",
      });
    }

    try {
      parseAllowedMapleStoryIoUrl(imageUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response;

    try {
      response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 MapleAvatarStudio/1.0",
          Accept: "image/png,image/webp,image/*,*/*",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      return res.status(response.status).json({
        success: false,
        message: "maplestory.io image lookup failed.",
        status: response.status,
        contentType,
        detail: errorText.slice(0, 500),
      });
    }

    if (!contentType.startsWith("image/")) {
      const text = await response.text().catch(() => "");

      return res.status(502).json({
        success: false,
        message: "Response was not an image.",
        contentType,
        detail: text.slice(0, 500),
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (error) {
    console.error("[MSIO Proxy Error]", error);

    res.status(500).json({
      success: false,
      message: "Image proxy failed.",
      detail: error.message,
      name: error.name,
      cause: error.cause?.message || null,
    });
  }
});

app.get("/api/msio/audio-proxy", async (req, res) => {
  try {
    const audioUrl = req.query.url;

    if (!audioUrl) {
      return res.status(400).json({
        success: false,
        message: "url query parameter is required.",
      });
    }

    try {
      parseAllowedMapleStoryIoUrl(audioUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const headers = {
      "User-Agent": "Mozilla/5.0 MapleAvatarStudio/1.0",
      Accept: "audio/*,*/*",
    };

    if (req.headers.range) {
      headers.Range = req.headers.range;
    }

    const response = await fetch(audioUrl, { headers });

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");
    const acceptRanges = response.headers.get("accept-ranges");

    if (!response.ok && response.status !== 206) {
      const errorText = await response.text().catch(() => "");

      return res.status(response.status).json({
        success: false,
        message: "maplestory.io audio lookup failed.",
        status: response.status,
        contentType,
        detail: errorText.slice(0, 500),
      });
    }

    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Accept-Ranges", acceptRanges || "bytes");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    if (contentRange) {
      res.setHeader("Content-Range", contentRange);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.send(buffer);
  } catch (error) {
    console.error("[MSIO Audio Proxy Error]", error);

    res.status(500).json({
      success: false,
      message: "Audio proxy failed.",
      detail: error.message,
      name: error.name,
      cause: error.cause?.message || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Maple Avatar Server running on http://localhost:${PORT}`);
});
