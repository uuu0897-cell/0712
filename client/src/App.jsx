import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const STORAGE_KEY = "maple-avatar-studio-scene-v2";
const PRODUCTION_API_BASE_URL = "https://maple-avatar-studio-api.onrender.com";
const LOCAL_API_BASE_URL = "http://localhost:4000";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  (typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? LOCAL_API_BASE_URL
    : PRODUCTION_API_BASE_URL);
const MSIO_BASE_URL = "https://maplestory.io/api/gms/238";

const STAGE_WIDTH = 720;
const STAGE_HEIGHT = 405;
const CHARACTER_BOTTOM_OFFSET = 90;
const CHARACTER_LANDING_Y = 378;
const MAX_HISTORY_LENGTH = 30;

function createSkyGradient(topColor, bottomColor) {
  return {
    top: topColor,
    bottom: bottomColor,
  };
}

function proxyImageUrl(url) {
  return `${API_BASE_URL}/api/msio/image-proxy?url=${encodeURIComponent(url)}`;
}

const SCENE_PRESETS = [
  {
    label: "체크 배경",
    value: "checker",
    mapId: null,
    imageUrl: "",
    thumbnailUrl: "",
    bgmPath: "",
    zoom: 1,
    positionX: 50,
    positionY: 50,
    fillColor: "#ffffff",
    skyGradient: null,
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 170, y: CHARACTER_LANDING_Y },
      { x: 280, y: CHARACTER_LANDING_Y },
      { x: 390, y: CHARACTER_LANDING_Y },
      { x: 500, y: CHARACTER_LANDING_Y },
      { x: 610, y: CHARACTER_LANDING_Y },
    ],
    removeWhite: false,
  },
  {
    label: "헤네시스",
    value: "henesys",
    mapId: 100000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/100000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/100000000/render/0`),
    bgmPath: "Bgm00/FloralLife",
    zoom: 4.35,
    positionX: 42,
    positionY: 21,
    spawnReference: { zoom: 5, positionX: 40, positionY: 40 },
    fillColor: "#bfeeff",
    skyGradient: createSkyGradient("#dff4ff", "#f8fdff"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 160, y: 360 },
      { x: 252, y: 351 },
      { x: 345, y: 344 },
      { x: 448, y: 338 },
      { x: 548, y: 343 },
      { x: 635, y: 350 },
    ],
    removeWhite: true,
  },
  {
    label: "엘리니아",
    value: "ellinia",
    mapId: 101000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/101000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/101000000/render/0`),
    bgmPath: "Bgm02/WhenTheMorningComes",
    zoom: 1.55,
    positionX: 49,
    positionY: 55,
    spawnReference: { zoom: 1.7, positionX: 49, positionY: 49 },
    fillColor: "#d9f7ce",
    skyGradient: createSkyGradient("#d8f4de", "#f2fff8"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 158, y: 352 },
      { x: 258, y: 345 },
      { x: 356, y: 339 },
      { x: 456, y: 336 },
      { x: 560, y: 341 },
      { x: 652, y: 348 },
    ],
    removeWhite: true,
  },
  {
    label: "커닝시티",
    value: "kerning-city",
    mapId: 103000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/103000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/103000000/render/0`),
    bgmPath: "Bgm01/BadGuys",
    zoom: 4.15,
    positionX: 48,
    positionY: 78,
    spawnReference: { zoom: 4.6, positionX: 48, positionY: 48 },
    fillColor: "#d8d1ca",
    skyGradient: createSkyGradient("#ebe2db", "#faf7f4"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 160, y: 356 },
      { x: 250, y: 349 },
      { x: 345, y: 345 },
      { x: 445, y: 340 },
      { x: 548, y: 346 },
      { x: 638, y: 352 },
    ],
    removeWhite: true,
  },
  {
    label: "리스항구",
    value: "lith-harbor",
    mapId: 104000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/104000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/104000000/render/0`),
    bgmPath: "Bgm02/AboveTheTreetops",
    zoom: 4.2,
    positionX: 46,
    positionY: 62,
    spawnReference: { zoom: 4.6, positionX: 44, positionY: 46 },
    fillColor: "#bfefff",
    skyGradient: createSkyGradient("#c9f2ff", "#f6fdff"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 152, y: 355 },
      { x: 242, y: 350 },
      { x: 338, y: 347 },
      { x: 442, y: 343 },
      { x: 546, y: 347 },
      { x: 640, y: 352 },
    ],
    removeWhite: true,
  },
  {
    label: "루디브리엄",
    value: "ludibrium",
    mapId: 220000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/220000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/220000000/render/0`),
    bgmPath: "Bgm06/FantasticThinking",
    zoom: 4.35,
    positionX: 48,
    positionY: 78,
    spawnReference: { zoom: 4.8, positionX: 47, positionY: 45 },
    fillColor: "#7ec8ff",
    skyGradient: createSkyGradient("#a9dfff", "#eef8ff"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 155, y: 356 },
      { x: 250, y: 350 },
      { x: 348, y: 344 },
      { x: 447, y: 340 },
      { x: 548, y: 346 },
      { x: 642, y: 352 },
    ],
    removeWhite: true,
  },
  {
    label: "페리온",
    value: "perion",
    mapId: 102000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/102000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/102000000/render/0`),
    bgmPath: "Bgm00/Nightmare",
    fallbackBgmPath: "Bgm01/BadGuys",
    zoom: 4.3,
    positionX: 22,
    positionY: 51,
    spawnReference: { zoom: 4.8, positionX: 49, positionY: 46 },
    fillColor: "#e4d8ca",
    skyGradient: createSkyGradient("#eadfce", "#fbf7f1"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 156, y: 360 },
      { x: 250, y: 354 },
      { x: 348, y: 347 },
      { x: 446, y: 340 },
      { x: 544, y: 347 },
      { x: 638, y: 354 },
    ],
    removeWhite: true,
  },
  {
    label: "오르비스",
    value: "orbis",
    mapId: 200000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/200000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/200000000/render/0`),
    bgmPath: "Bgm04/Shinin'Harbor",
    fallbackBgmPath: "Bgm02/AboveTheTreetops",
    zoom: 4.15,
    positionX: 64,
    positionY: 90,
    spawnReference: { zoom: 4.6, positionX: 50, positionY: 46 },
    fillColor: "#dff4ff",
    skyGradient: createSkyGradient("#e7f7ff", "#ffffff"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 152, y: 356 },
      { x: 246, y: 349 },
      { x: 340, y: 344 },
      { x: 438, y: 339 },
      { x: 540, y: 344 },
      { x: 636, y: 350 },
    ],
    removeWhite: true,
  },
  {
    label: "아쿠아리움",
    value: "aquarium",
    mapId: 230000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/230000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/230000000/render/0`),
    bgmPath: "Bgm11/Aquarium",
    fallbackBgmPath: "Bgm00/FloralLife",
    zoom: 2.75,
    positionX: 49,
    positionY: 45,
    spawnReference: { zoom: 4.4, positionX: 49, positionY: 48 },
    fillColor: "#d3f3ff",
    skyGradient: createSkyGradient("#c8efff", "#f4fcff"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 150, y: 357 },
      { x: 246, y: 351 },
      { x: 346, y: 345 },
      { x: 446, y: 341 },
      { x: 546, y: 346 },
      { x: 640, y: 352 },
    ],
    removeWhite: true,
  },
  {
    label: "아리안트",
    value: "ariant",
    mapId: 260000000,
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/260000000/render/0`),
    thumbnailUrl: proxyImageUrl(`${MSIO_BASE_URL}/map/260000000/render/0`),
    bgmPath: "Bgm14/HotDesert",
    fallbackBgmPath: "Bgm06/FantasticThinking",
    zoom: 6,
    positionX: 56,
    positionY: 0,
    spawnReference: { zoom: 4.8, positionX: 50, positionY: 48 },
    fillColor: "#f5e5c4",
    skyGradient: createSkyGradient("#f5dfb3", "#fff7e9"),
    defaultCharacterY: CHARACTER_LANDING_Y,
    spawnPoints: [
      { x: 154, y: 358 },
      { x: 248, y: 352 },
      { x: 346, y: 345 },
      { x: 446, y: 340 },
      { x: 544, y: 346 },
      { x: 636, y: 352 },
    ],
    removeWhite: true,
  },
];

const OBJECT_PRESETS = [
  {
    label: "달팽이",
    value: "snail",
    type: "monster",
    mobId: "100100",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100100/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 34,
  },
  {
    label: "파란 달팽이",
    value: "blue-snail",
    type: "monster",
    mobId: "100101",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100101/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 36,
  },
  {
    label: "빨간 달팽이",
    value: "red-snail",
    type: "monster",
    mobId: "100102",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100102/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 38,
  },
  {
    label: "주황버섯",
    value: "orange-mushroom",
    type: "monster",
    mobId: "100004",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100004/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 48,
  },
  {
    label: "슬라임",
    value: "slime",
    type: "monster",
    mobId: "100006",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100006/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 42,
  },
  {
    label: "돼지",
    value: "pig",
    type: "monster",
    mobId: "100007",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100007/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 46,
  },
  {
    label: "스텀프",
    value: "stump",
    type: "monster",
    mobId: "100005",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/100005/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 44,
  },
  {
    label: "초록버섯",
    value: "green-mushroom",
    type: "monster",
    mobId: "1110100",
    imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/1110100/icon`),
    x: 520,
    y: 352,
    scale: 1,
    baseSize: 50,
  },
];

const ACTIONS = [
  { label: "기본 자세 1", value: "A00" },
  { label: "기본 자세 2", value: "A01" },
  { label: "걷기 1", value: "A02" },
  { label: "걷기 2", value: "A03" },
  { label: "엎드리기", value: "A04" },
  { label: "앉기", value: "A05" },
  { label: "점프", value: "A06" },
  { label: "날기", value: "A07" },
  { label: "사다리", value: "A08" },
  { label: "줄타기", value: "A09" },
  { label: "죽음", value: "A33" },
];

const EMOTIONS = [
  { label: "기본", value: "E00" },
  { label: "윙크", value: "E01" },
  { label: "웃음", value: "E02" },
  { label: "울음", value: "E03" },
  { label: "화남", value: "E04" },
  { label: "당황", value: "E05" },
  { label: "곤란", value: "E06" },
  { label: "반짝", value: "E13" },
  { label: "하트", value: "E17" },
  { label: "아픔", value: "E19" },
  { label: "기절", value: "E23" },
];

const WEAPON_MOTIONS = [
  { label: "기본", value: "W00" },
  { label: "한손 무기", value: "W01" },
  { label: "두손 무기", value: "W02" },
  { label: "건 무기", value: "W03" },
  { label: "무기 제외", value: "W04" },
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function createTransparentMapImage(src) {
  const image = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    if (r > 252 && g > 252 && b > 252) {
      data[index + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

function buildCharacterImageUrl(baseUrl, options) {
  if (!baseUrl) return "";

  const url = new URL(baseUrl);

  url.searchParams.set("action", options.action);
  url.searchParams.set("emotion", options.emotion);
  url.searchParams.set("wmotion", options.wmotion);
  url.searchParams.set("width", "300");
  url.searchParams.set("height", "300");
  url.searchParams.set("x", "150");
  url.searchParams.set("y", "230");

  return url.toString();
}

function getDefaultCharacterPosition(index, defaultY) {
  const startX = 120;
  const endX = STAGE_WIDTH - 120;
  const maxMembers = 6;
  const safeIndex = Math.min(index, maxMembers - 1);
  const gap = (endX - startX) / (maxMembers - 1);

  return {
    x: Math.round(startX + gap * safeIndex),
    y: defaultY,
  };
}

function buildBackgroundDrawMetrics(image, zoom, positionX, positionY) {
  const drawWidth = STAGE_WIDTH * zoom;
  const drawHeight = image.height * (drawWidth / image.width);
  const drawX = (STAGE_WIDTH - drawWidth) * (positionX / 100);
  const drawY = (STAGE_HEIGHT - drawHeight) * (positionY / 100);

  return {
    drawWidth,
    drawHeight,
    drawX,
    drawY,
  };
}

function convertStagePointBetweenViews(point, image, referenceView, nextView) {
  const referenceMetrics = buildBackgroundDrawMetrics(
    image,
    referenceView.zoom,
    referenceView.positionX,
    referenceView.positionY
  );
  const nextMetrics = buildBackgroundDrawMetrics(
    image,
    nextView.zoom,
    nextView.positionX,
    nextView.positionY
  );

  const normalizedX = (point.x - referenceMetrics.drawX) / referenceMetrics.drawWidth;
  const normalizedY = (point.y - referenceMetrics.drawY) / referenceMetrics.drawHeight;

  return {
    x: Math.round(nextMetrics.drawX + normalizedX * nextMetrics.drawWidth),
    y: Math.round(nextMetrics.drawY + normalizedY * nextMetrics.drawHeight),
  };
}

function createMemberFromCharacter(data, position) {
  return {
    id: crypto.randomUUID(),
    characterName: data.character_name,
    worldName: data.world_name,
    characterClass: data.character_class,
    level: data.character_level,
    ocid: data.ocid,
    baseImageUrl: data.character_image,
    action: "A00",
    emotion: "E00",
    wmotion: "W04",
    x: position.x,
    y: position.y,
    scale: 1,
  };
}

function getCharacterPositionFromSpawnPoints(spawnPoints, defaultY, index) {
  const spawnPoint = spawnPoints?.[index];

  if (spawnPoint) {
    return {
      x: spawnPoint.x,
      y: spawnPoint.y,
    };
  }

  return getDefaultCharacterPosition(index, defaultY || CHARACTER_LANDING_Y);
}

function getPresetGradientCss(preset) {
  if (!preset?.skyGradient) return "";
  return `linear-gradient(180deg, ${preset.skyGradient.top} 0%, ${preset.skyGradient.bottom} 100%)`;
}

function extractDetailMessage(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (typeof detail?.message === "string" && detail.message.trim()) {
    return detail.message;
  }
  if (typeof detail?.error?.message === "string" && detail.error.message.trim()) {
    return detail.error.message;
  }
  if (typeof detail?.errorMessage === "string" && detail.errorMessage.trim()) {
    return detail.errorMessage;
  }

  try {
    return JSON.stringify(detail);
  } catch {
    return "";
  }
}

function formatRequestError(data, fallbackMessage) {
  const baseMessage =
    data?.userMessage ||
    extractDetailMessage(data?.detail) ||
    data?.message ||
    fallbackMessage;

  if (data?.status) {
    return `${baseMessage} (HTTP ${data.status})`;
  }

  return baseMessage;
}

export default function App() {
  const audioRef = useRef(null);

  const [activePanel, setActivePanel] = useState("scene");

  const [characterName, setCharacterName] = useState("");
  const [partyMembers, setPartyMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [processedBackgroundUrl, setProcessedBackgroundUrl] = useState("");
  const [backgroundFit, setBackgroundFit] = useState("cover");
  const [backgroundZoom, setBackgroundZoom] = useState(1);
  const [backgroundPositionX, setBackgroundPositionX] = useState(50);
  const [backgroundPositionY, setBackgroundPositionY] = useState(50);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [computedSpawnPointsByPreset, setComputedSpawnPointsByPreset] = useState({});

  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedObjectIds, setSelectedObjectIds] = useState([]);
  const [selectedMapValue, setSelectedMapValue] = useState("checker");
  const [selectedObjectPresetValue, setSelectedObjectPresetValue] = useState(
    OBJECT_PRESETS[0].value
  );

  const [customObjectId, setCustomObjectId] = useState("");
  const [customObjectName, setCustomObjectName] = useState("");

  const [dragInfo, setDragInfo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicError, setMusicError] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [exportScale, setExportScale] = useState(2);
  const [includeBackgroundInExport, setIncludeBackgroundInExport] = useState(true);
  const [transparentExport, setTransparentExport] = useState(false);

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [hasLoadedSavedScene, setHasLoadedSavedScene] = useState(false);

  const selectedMapPreset = useMemo(() => {
    return (
      SCENE_PRESETS.find((preset) => preset.value === selectedMapValue) ||
      SCENE_PRESETS[0]
    );
  }, [selectedMapValue]);

  const selectedMembers = useMemo(() => {
    return partyMembers.filter((member) => selectedMemberIds.includes(member.id));
  }, [partyMembers, selectedMemberIds]);

  const primarySelectedMember = selectedMembers[0] || null;

  const primarySelectedObject = useMemo(() => {
    return (
      sceneObjects.find((object) => selectedObjectIds.includes(object.id)) ||
      null
    );
  }, [sceneObjects, selectedObjectIds]);

  const selectedObjectScale = primarySelectedObject?.scale || 1;
  const displayBackgroundUrl = processedBackgroundUrl || backgroundUrl;
  const hasBgm = Boolean(selectedMapPreset.bgmPath);
  const stageSkyGradient = getPresetGradientCss(selectedMapPreset);

  const getPresetCharacterPosition = (preset, index) => {
    const spawnPoints =
      computedSpawnPointsByPreset[preset?.value] || preset?.spawnPoints || [];

    return getCharacterPositionFromSpawnPoints(
      spawnPoints,
      preset?.defaultCharacterY,
      index
    );
  };

  const getSceneSnapshot = () => ({
    partyMembers,
    sceneObjects,
    selectedMemberIds,
    selectedObjectIds,
    selectedMapValue,
    backgroundUrl: backgroundUrl?.startsWith("blob:") ? "" : backgroundUrl,
    processedBackgroundUrl: "",
    backgroundFit,
    backgroundZoom,
    backgroundPositionX,
    backgroundPositionY,
    activePanel,
    exportScale,
    includeBackgroundInExport,
    transparentExport,
  });

  const applySceneSnapshot = (snapshot) => {
    if (!snapshot) return;

    const snapshotPreset =
      SCENE_PRESETS.find((preset) => preset.value === snapshot.selectedMapValue) ||
      SCENE_PRESETS[0];
    const migratedMembers = (snapshot.partyMembers || []).map((member, index) => {
      if (member.y >= 360) {
        return member;
      }

      const position = getPresetCharacterPosition(snapshotPreset, index);

      return {
        ...member,
        x: position.x,
        y: position.y,
      };
    });

    setPartyMembers(migratedMembers);
    setSceneObjects(snapshot.sceneObjects || []);
    setSelectedMemberIds(snapshot.selectedMemberIds || []);
    setSelectedObjectIds(snapshot.selectedObjectIds || []);
    setSelectedMapValue(snapshot.selectedMapValue || "checker");
    setBackgroundUrl(snapshot.backgroundUrl || "");
    setProcessedBackgroundUrl(snapshot.processedBackgroundUrl || "");
    setBackgroundFit(snapshot.backgroundFit || "cover");
    setBackgroundZoom(snapshot.backgroundZoom || 1);
    setBackgroundPositionX(snapshot.backgroundPositionX ?? 50);
    setBackgroundPositionY(snapshot.backgroundPositionY ?? 50);
    setActivePanel(snapshot.activePanel || "scene");
    setExportScale(snapshot.exportScale || 2);
    setIncludeBackgroundInExport(snapshot.includeBackgroundInExport ?? true);
    setTransparentExport(snapshot.transparentExport ?? false);
    stopMusic();
  };

  const rememberScene = () => {
    const snapshot = getSceneSnapshot();

    setHistory((prev) => [...prev.slice(-(MAX_HISTORY_LENGTH - 1)), snapshot]);
    setFuture([]);
  };

  const undoScene = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;

      const previous = prev[prev.length - 1];
      setFuture((items) => [getSceneSnapshot(), ...items].slice(0, MAX_HISTORY_LENGTH));
      applySceneSnapshot(previous);

      return prev.slice(0, -1);
    });
  };

  const redoScene = () => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;

      const next = prev[0];
      setHistory((items) => [...items.slice(-(MAX_HISTORY_LENGTH - 1)), getSceneSnapshot()]);
      applySceneSnapshot(next);

      return prev.slice(1);
    });
  };

  const stopMusic = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsMusicOn(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const rawScene = localStorage.getItem(STORAGE_KEY);

        if (rawScene) {
          applySceneSnapshot(JSON.parse(rawScene));
          setSaveMessage("저장된 작업을 불러왔습니다.");
        }
      } catch (error) {
        console.error("Saved scene load failed:", error);
      } finally {
        setHasLoadedSavedScene(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
    // Saved scene should be restored only once when the app boots.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedScene) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(getSceneSnapshot()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasLoadedSavedScene,
    partyMembers,
    sceneObjects,
    selectedMemberIds,
    selectedObjectIds,
    selectedMapValue,
    backgroundUrl,
    backgroundFit,
    backgroundZoom,
    backgroundPositionX,
    backgroundPositionY,
    activePanel,
    exportScale,
    includeBackgroundInExport,
    transparentExport,
  ]);

  useEffect(() => {
    if (!saveMessage) return;

    const timeoutId = setTimeout(() => setSaveMessage(""), 2200);
    return () => clearTimeout(timeoutId);
  }, [saveMessage]);

  const playMusicForPreset = async (preset) => {
    const audio = audioRef.current;

    if (!audio) return;

    setMusicError("");

    if (!preset?.bgmPath) {
      stopMusic();
      return;
    }

    const candidatePaths = [preset.bgmPath, preset.fallbackBgmPath].filter(Boolean);

    for (const bgmPath of candidatePaths) {
      const audioUrl = `${MSIO_BASE_URL}/music/${bgmPath}`;

      if (audio.src === audioUrl && !audio.paused) {
        setIsMusicOn(true);
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.src = audioUrl;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.45;

      try {
        await audio.play();
        setIsMusicOn(true);
        return;
      } catch (error) {
        console.error(`BGM play failed for ${bgmPath}:`, error);
      }
    }

    setIsMusicOn(false);
    setMusicError("BGM 재생이 차단되었거나 오디오를 불러오지 못했습니다.");
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isMusicOn) {
      audio.pause();
      setIsMusicOn(false);
      return;
    }

    await playMusicForPreset(selectedMapPreset);
  };

  const prepareMapImage = async (preset) => {
    if (!preset.imageUrl) {
      setProcessedBackgroundUrl("");
      return null;
    }

    setIsMapLoading(true);
    setErrorMessage("");

    try {
      const image = await loadImage(preset.imageUrl);
      let nextSpawnPoints = preset.spawnPoints || [];

      if (preset.spawnReference && preset.spawnPoints?.length) {
        nextSpawnPoints = preset.spawnPoints.map((point) =>
          convertStagePointBetweenViews(point, image, preset.spawnReference, {
            zoom: preset.zoom,
            positionX: preset.positionX,
            positionY: preset.positionY,
          })
        );
        setComputedSpawnPointsByPreset((prev) => ({
          ...prev,
          [preset.value]: nextSpawnPoints,
        }));
      }

      if (preset.removeWhite) {
        const transparentUrl = await createTransparentMapImage(preset.imageUrl);
        setProcessedBackgroundUrl(transparentUrl);
      } else {
        setProcessedBackgroundUrl("");
      }

      return nextSpawnPoints;
    } catch (error) {
      console.error(error);
      setProcessedBackgroundUrl("");
      setErrorMessage("맵 데이터를 불러오지 못했습니다.");
      return null;
    } finally {
      setIsMapLoading(false);
    }
  };

  const getMemberImageUrl = (member) => {
    return buildCharacterImageUrl(member.baseImageUrl, {
      action: member.action,
      emotion: member.emotion,
      wmotion: member.wmotion,
    });
  };

  const getStagePoint = (event, stageElement) => {
    const rect = stageElement.getBoundingClientRect();

    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * STAGE_WIDTH),
      y: Math.round(((event.clientY - rect.top) / rect.height) * STAGE_HEIGHT),
    };
  };

  const moveSceneObjectToPointer = (event) => {
    if (!dragInfo || dragInfo.kind !== "object") return;

    const point = getStagePoint(event, event.currentTarget);
    const deltaX = point.x - dragInfo.startX;
    const deltaY = point.y - dragInfo.startY;

    setSceneObjects((prev) =>
      prev.map((object) => {
        const startPosition = dragInfo.objects.find((item) => item.id === object.id);

        if (!startPosition) return object;

        return {
          ...object,
          x: Math.max(0, Math.min(STAGE_WIDTH, startPosition.x + deltaX)),
          y: Math.max(0, Math.min(STAGE_HEIGHT, startPosition.y + deltaY)),
        };
      })
    );
  };

  const moveMemberToPointer = (event) => {
    if (!dragInfo) return;

    if (dragInfo.kind === "object") {
      moveSceneObjectToPointer(event);
      return;
    }

    const point = getStagePoint(event, event.currentTarget);
    const deltaX = point.x - dragInfo.startX;
    const deltaY = point.y - dragInfo.startY;

    setPartyMembers((prev) =>
      prev.map((member) => {
        const startPosition = dragInfo.members.find((item) => item.id === member.id);

        if (!startPosition) return member;

        return {
          ...member,
          x: Math.max(0, Math.min(STAGE_WIDTH, startPosition.x + deltaX)),
          y: Math.max(0, Math.min(STAGE_HEIGHT, startPosition.y + deltaY)),
        };
      })
    );
  };

  const addCharacter = async () => {
    try {
      const name = characterName.trim();

      if (!name) {
        setErrorMessage("캐릭터명을 입력해주세요.");
        return;
      }

      if (partyMembers.length >= 6) {
        setErrorMessage("캐릭터는 최대 6명까지 추가할 수 있습니다.");
        return;
      }

      setLoading(true);
      setErrorMessage("");
      rememberScene();

      const response = await fetch(
        `${API_BASE_URL}/api/maple/character?characterName=${encodeURIComponent(name)}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(formatRequestError(data, "캐릭터 조회에 실패했습니다."));
      }

      const exists = partyMembers.some(
        (member) => member.characterName === data.character_name
      );

      if (exists) {
        setErrorMessage("이미 추가한 캐릭터입니다.");
        return;
      }

      const position = getPresetCharacterPosition(selectedMapPreset, partyMembers.length);
      const newMember = createMemberFromCharacter(data, position);

      setPartyMembers((prev) => [...prev, newMember]);
      setSelectedMemberIds([newMember.id]);
      setSelectedObjectIds([]);
      setCharacterName("");
      setActivePanel("character");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedObjectIds([]);

    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );

    setActivePanel("character");
  };

  const selectAllMembers = () => {
    setSelectedObjectIds([]);
    setSelectedMemberIds(partyMembers.map((member) => member.id));
    setActivePanel("character");
  };

  const clearSelectedMembers = () => {
    setSelectedMemberIds([]);
  };

  const updateSelectedMembers = (patch) => {
    if (selectedMemberIds.length === 0) return;

    rememberScene();

    setPartyMembers((prev) =>
      prev.map((member) =>
        selectedMemberIds.includes(member.id) ? { ...member, ...patch } : member
      )
    );
  };

  const removeMember = (memberId) => {
    rememberScene();
    setPartyMembers((prev) => prev.filter((member) => member.id !== memberId));
    setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  const alignSelectedBottom = () => {
    if (selectedMemberIds.length === 0) return;

    rememberScene();

    const targets = partyMembers.filter((member) =>
      selectedMemberIds.includes(member.id)
    );

    const targetY = Math.max(...targets.map((member) => member.y));

    setPartyMembers((prev) =>
      prev.map((member) =>
        selectedMemberIds.includes(member.id) ? { ...member, y: targetY } : member
      )
    );
  };

  const landSelectedMembers = () => {
    if (selectedMemberIds.length === 0) return;

    rememberScene();

    setPartyMembers((prev) =>
      prev.map((member) =>
        selectedMemberIds.includes(member.id)
          ? { ...member, y: selectedMapPreset.defaultCharacterY }
          : member
      )
    );
  };

  const distributeSelectedHorizontally = () => {
    const targets = partyMembers.filter((member) =>
      selectedMemberIds.includes(member.id)
    );

    if (targets.length <= 1) return;

    rememberScene();

    const sortedTargets = [...targets].sort((a, b) => a.x - b.x);
    const minX = Math.min(...sortedTargets.map((member) => member.x));
    const maxX = Math.max(...sortedTargets.map((member) => member.x));

    const startX = Math.max(80, minX);
    const endX = Math.min(STAGE_WIDTH - 80, maxX);
    const gap = (endX - startX) / (sortedTargets.length - 1);

    const nextPositions = sortedTargets.map((member, index) => ({
      id: member.id,
      x: Math.round(startX + gap * index),
    }));

    setPartyMembers((prev) =>
      prev.map((member) => {
        const next = nextPositions.find((item) => item.id === member.id);
        return next ? { ...member, x: next.x } : member;
      })
    );
  };

  const spreadSelectedAcrossStage = () => {
    const targets = partyMembers.filter((member) =>
      selectedMemberIds.includes(member.id)
    );

    if (targets.length <= 1) return;

    rememberScene();

    const sortedTargets = [...targets].sort((a, b) => a.x - b.x);
    const startX = 120;
    const endX = STAGE_WIDTH - 120;
    const gap = (endX - startX) / (sortedTargets.length - 1);
    const baseY = selectedMapPreset.defaultCharacterY;

    const nextPositions = sortedTargets.map((member, index) => ({
      id: member.id,
      x: Math.round(startX + gap * index),
      y: baseY,
    }));

    setPartyMembers((prev) =>
      prev.map((member) => {
        const next = nextPositions.find((item) => item.id === member.id);
        return next ? { ...member, x: next.x, y: next.y } : member;
      })
    );
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    rememberScene();

    if (backgroundUrl && backgroundUrl.startsWith("blob:")) {
      URL.revokeObjectURL(backgroundUrl);
    }

    const url = URL.createObjectURL(file);

    setBackgroundUrl(url);
    setProcessedBackgroundUrl("");
    setSelectedMapValue("checker");
    setBackgroundFit("cover");
    setBackgroundZoom(1);
    setBackgroundPositionX(50);
    setBackgroundPositionY(50);
    setErrorMessage("");
  };

  const resetBackground = () => {
    rememberScene();

    if (backgroundUrl && backgroundUrl.startsWith("blob:")) {
      URL.revokeObjectURL(backgroundUrl);
    }

    setBackgroundUrl("");
    setProcessedBackgroundUrl("");
    setSelectedMapValue("checker");
    setBackgroundZoom(1);
    setBackgroundPositionX(50);
    setBackgroundPositionY(50);
    stopMusic();
  };

  const applyScenePreset = async (presetValue) => {
    const preset = SCENE_PRESETS.find((item) => item.value === presetValue);

    if (!preset) return;

    rememberScene();
    setIsMapLoading(true);

    if (backgroundUrl && backgroundUrl.startsWith("blob:")) {
      URL.revokeObjectURL(backgroundUrl);
    }

    setSelectedMapValue(preset.value);
    setBackgroundUrl(preset.imageUrl);
    setProcessedBackgroundUrl("");
    setBackgroundFit("cover");
    setBackgroundZoom(preset.zoom);
    setBackgroundPositionX(preset.positionX);
    setBackgroundPositionY(preset.positionY);

    setSceneObjects((prev) =>
      prev.map((object) => ({
        ...object,
        y: preset.defaultCharacterY,
      }))
    );

    let nextSpawnPoints = preset.spawnPoints || [];

    if (preset.imageUrl) {
      nextSpawnPoints = (await prepareMapImage(preset)) || nextSpawnPoints;
    } else {
      setProcessedBackgroundUrl("");
      setIsMapLoading(false);
    }

    setPartyMembers((prev) =>
      prev.map((member, index) => {
        const position = getCharacterPositionFromSpawnPoints(
          nextSpawnPoints,
          preset.defaultCharacterY,
          index
        );

        return {
          ...member,
          x: position.x,
          y: position.y,
        };
      })
    );

    if (preset.bgmPath && isMusicOn) {
      await playMusicForPreset(preset);
    } else {
      setMusicError("");
    }
  };

  const addSceneObjectFromPreset = () => {
    const preset = OBJECT_PRESETS.find(
      (item) => item.value === selectedObjectPresetValue
    );

    if (!preset) return;

    rememberScene();

    const newObject = {
      ...preset,
      id: crypto.randomUUID(),
      y: selectedMapPreset.defaultCharacterY,
    };

    setSceneObjects((prev) => [...prev, newObject]);
    setSelectedObjectIds([newObject.id]);
    setSelectedMemberIds([]);
    setActivePanel("object");
  };

  const addCustomMonster = () => {
    const mobId = customObjectId.trim();

    if (!mobId) {
      setErrorMessage("몬스터 ID를 입력해주세요.");
      return;
    }

    rememberScene();

    const newObject = {
      id: crypto.randomUUID(),
      type: "monster",
      label: customObjectName.trim() || `Mob ${mobId}`,
      value: `custom-${mobId}-${Date.now()}`,
      mobId,
      imageUrl: proxyImageUrl(`${MSIO_BASE_URL}/mob/${mobId}/icon`),
      x: 520,
      y: selectedMapPreset.defaultCharacterY,
      scale: 1,
      baseSize: 48,
    };

    setSceneObjects((prev) => [...prev, newObject]);
    setSelectedObjectIds([newObject.id]);
    setSelectedMemberIds([]);
    setCustomObjectId("");
    setCustomObjectName("");
    setActivePanel("object");
  };

  const removeSceneObject = (objectId) => {
    rememberScene();
    setSceneObjects((prev) => prev.filter((object) => object.id !== objectId));
    setSelectedObjectIds((prev) => prev.filter((id) => id !== objectId));
  };

  const removeSelectedObjects = () => {
    if (selectedObjectIds.length === 0) return;

    rememberScene();

    setSceneObjects((prev) =>
      prev.filter((object) => !selectedObjectIds.includes(object.id))
    );
    setSelectedObjectIds([]);
  };

  const updateSelectedObjects = (patch) => {
    if (selectedObjectIds.length === 0) return;

    rememberScene();

    setSceneObjects((prev) =>
      prev.map((object) =>
        selectedObjectIds.includes(object.id) ? { ...object, ...patch } : object
      )
    );
  };

  const renderBackground = async (ctx, options = {}) => {
    const includeBackground = options.includeBackground ?? true;
    const transparent = options.transparent ?? false;

    if (!includeBackground) {
      if (!transparent) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      }
      return;
    }

    if (!transparent || displayBackgroundUrl) {
      if (selectedMapPreset.skyGradient) {
        const gradient = ctx.createLinearGradient(0, 0, 0, STAGE_HEIGHT);
        gradient.addColorStop(0, selectedMapPreset.skyGradient.top);
        gradient.addColorStop(1, selectedMapPreset.skyGradient.bottom);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = selectedMapPreset.fillColor || "#ffffff";
      }

      ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    }

    if (!displayBackgroundUrl) {
      if (transparent) return;

      const tileSize = 24;

      for (let y = 0; y < STAGE_HEIGHT; y += tileSize) {
        for (let x = 0; x < STAGE_WIDTH; x += tileSize) {
          const isEven = (x / tileSize + y / tileSize) % 2 === 0;
          ctx.fillStyle = isEven ? "#f3f4f6" : "#ffffff";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      return;
    }

    const bgImage = await loadImage(displayBackgroundUrl);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (backgroundFit === "contain") {
      const scale = Math.min(
        STAGE_WIDTH / bgImage.width,
        STAGE_HEIGHT / bgImage.height
      );

      const drawWidth = bgImage.width * scale;
      const drawHeight = bgImage.height * scale;
      const drawX = (STAGE_WIDTH - drawWidth) / 2;
      const drawY = (STAGE_HEIGHT - drawHeight) / 2;

      ctx.drawImage(bgImage, drawX, drawY, drawWidth, drawHeight);
      return;
    }

    /*
      Keep canvas export aligned with the CSS preview, which renders map
      backgrounds with background-size: `${100 * backgroundZoom}% auto`.
    */

    const drawWidth = STAGE_WIDTH * backgroundZoom;
    const drawHeight = bgImage.height * (drawWidth / bgImage.width);

    const drawX = (STAGE_WIDTH - drawWidth) * (backgroundPositionX / 100);
    const drawY = (STAGE_HEIGHT - drawHeight) * (backgroundPositionY / 100);

    ctx.drawImage(bgImage, drawX, drawY, drawWidth, drawHeight);
  };

  const renderSceneObjects = async (ctx) => {
    for (const object of sceneObjects) {
      const image = await loadImage(object.imageUrl);

      const drawWidth = object.baseSize * object.scale;
      const drawHeight = drawWidth * (image.height / image.width);
      const drawX = object.x - drawWidth / 2;
      const drawY = object.y - drawHeight;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }
  };

  const renderCharacters = async (ctx) => {
    for (const member of partyMembers) {
      const imageUrl = getMemberImageUrl(member);
      const charImage = await loadImage(imageUrl);

      const drawWidth = 300 * member.scale;
      const drawHeight = 300 * member.scale;
      const drawX = member.x - drawWidth / 2;
      const drawY =
        member.y - drawHeight + CHARACTER_BOTTOM_OFFSET * member.scale;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(charImage, drawX, drawY, drawWidth, drawHeight);
    }
  };

  const renderSceneCanvas = async (options = {}) => {
    const scale = options.scale || exportScale;
    const canvas = document.createElement("canvas");
    canvas.width = STAGE_WIDTH * scale;
    canvas.height = STAGE_HEIGHT * scale;

    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    await renderBackground(ctx, {
      includeBackground: options.includeBackground ?? includeBackgroundInExport,
      transparent: options.transparent ?? transparentExport,
    });
    await renderSceneObjects(ctx);
    await renderCharacters(ctx);

    return canvas;
  };

  const openPreview = async () => {
    try {
      if (partyMembers.length === 0 && sceneObjects.length === 0 && !backgroundUrl) {
        setErrorMessage("확대해서 볼 장면이 없습니다.");
        return;
      }

      const canvas = await renderSceneCanvas();
      setPreviewUrl(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error(error);
      setErrorMessage("미리보기 생성 중 오류가 발생했습니다.");
    }
  };

  const downloadImage = async () => {
    try {
      if (partyMembers.length === 0 && sceneObjects.length === 0 && !backgroundUrl) {
        setErrorMessage("저장할 장면이 없습니다.");
        return;
      }

      const canvas = await renderSceneCanvas();

      const link = document.createElement("a");
      link.download = `maple-party-shot-${exportScale}x.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error(error);
      setErrorMessage("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  const saveSceneNow = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getSceneSnapshot()));
    setSaveMessage("현재 작업을 저장했습니다.");
  };

  const loadSavedScene = () => {
    try {
      const rawScene = localStorage.getItem(STORAGE_KEY);

      if (!rawScene) {
        setErrorMessage("불러올 저장 작업이 없습니다.");
        return;
      }

      rememberScene();
      applySceneSnapshot(JSON.parse(rawScene));
      setSaveMessage("저장된 작업을 불러왔습니다.");
    } catch (error) {
      console.error(error);
      setErrorMessage("저장된 작업을 불러오지 못했습니다.");
    }
  };

  const resetStudio = () => {
    rememberScene();
    localStorage.removeItem(STORAGE_KEY);
    setPartyMembers([]);
    setSceneObjects([]);
    setSelectedMemberIds([]);
    setSelectedObjectIds([]);
    resetBackground();
    setActivePanel("scene");
    setPreviewUrl("");
    setSaveMessage("작업을 초기화했습니다.");
  };

  const selectLayer = (layer) => {
    if (layer.kind === "member") {
      setSelectedMemberIds([layer.id]);
      setSelectedObjectIds([]);
      setActivePanel("character");
      return;
    }

    setSelectedObjectIds([layer.id]);
    setSelectedMemberIds([]);
    setActivePanel("object");
  };

  const removeLayer = (layer) => {
    if (layer.kind === "member") {
      removeMember(layer.id);
      return;
    }

    removeSceneObject(layer.id);
  };

  const sceneLayers = [
    ...partyMembers.map((member) => ({
      id: member.id,
      kind: "member",
      label: member.characterName,
      meta: member.characterClass,
      y: member.y,
      selected: selectedMemberIds.includes(member.id),
    })),
    ...sceneObjects.map((object) => ({
      id: object.id,
      kind: "object",
      label: object.label,
      meta: object.type,
      y: object.y,
      selected: selectedObjectIds.includes(object.id),
    })),
  ].sort((a, b) => b.y - a.y);

  const stageBackgroundSize =
    displayBackgroundUrl && backgroundFit === "cover"
      ? `${100 * backgroundZoom}% auto`
      : displayBackgroundUrl
        ? "contain"
        : undefined;

  return (
    <main className="page">
      <audio ref={audioRef} />

      <section className="header">
        <h1>Maple Avatar Studio</h1>
        <p>메이플 캐릭터와 몬스터를 조합하고 배치해 나만의 파티샷을 저장해보세요.</p>
      </section>

      <section className="searchBox">
        <input
          value={characterName}
          onChange={(event) => setCharacterName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addCharacter();
          }}
          placeholder="캐릭터명을 입력하세요"
        />

        <button onClick={addCharacter} disabled={loading}>
          {loading ? "추가 중..." : "캐릭터 추가"}
        </button>
      </section>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {saveMessage && <p className="saveMessage">{saveMessage}</p>}

      <section className="studioToolbar" aria-label="Studio tools">
        <button type="button" onClick={undoScene} disabled={history.length === 0}>
          되돌리기
        </button>
        <button type="button" onClick={redoScene} disabled={future.length === 0}>
          다시하기
        </button>
        <button type="button" onClick={saveSceneNow}>
          저장
        </button>
        <button type="button" onClick={loadSavedScene}>
          불러오기
        </button>
        <button type="button" className="dangerTextButton" onClick={resetStudio}>
          초기화
        </button>
      </section>

      <section className="workspace">
        <section className="stageSection">
          <div
            className={`stage ${displayBackgroundUrl ? "" : "checker"}`}
            style={{
              backgroundColor: selectedMapPreset.fillColor,
              backgroundImage: displayBackgroundUrl
                ? `url(${displayBackgroundUrl})${stageSkyGradient ? `, ${stageSkyGradient}` : ""}`
                : stageSkyGradient || undefined,
              backgroundSize: displayBackgroundUrl
                ? `${stageBackgroundSize}, cover`
                : undefined,
              backgroundPosition: displayBackgroundUrl
                ? `${backgroundPositionX}% ${backgroundPositionY}%, center`
                : undefined,
              backgroundRepeat: displayBackgroundUrl ? "no-repeat, no-repeat" : undefined,
            }}
            onPointerMove={moveMemberToPointer}
            onPointerUp={() => setDragInfo(null)}
            onPointerCancel={() => setDragInfo(null)}
          >
            {isMapLoading && (
              <div className="mapLoadingOverlay">
                <div className="mapLoadingSpinner" />
                <strong>맵 데이터를 불러오는 중입니다</strong>
                <span>MapleStory.IO 맵 데이터를 준비하고 있습니다.</span>
              </div>
            )}

            {partyMembers.length === 0 && sceneObjects.length === 0 && !displayBackgroundUrl && (
              <div className="stageEmptyState">
                <strong>장면을 만들어보세요</strong>
                <span>캐릭터를 추가하거나 오른쪽에서 맵과 몬스터를 배치할 수 있습니다.</span>
              </div>
            )}

            {!isMapLoading &&
              sceneObjects.map((object) => {
              const isSelected = selectedObjectIds.includes(object.id);
              const objectSize = object.baseSize * object.scale;

              return (
                <div
                  key={object.id}
                  className={`sceneObjectHitbox ${isSelected ? "selected" : ""}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const stageElement = event.currentTarget.closest(".stage");
                    if (!stageElement) return;

                    const point = getStagePoint(event, stageElement);
                    const isAlreadySelected = selectedObjectIds.includes(object.id);
                    const targetIds = isAlreadySelected ? selectedObjectIds : [object.id];

                    rememberScene();

                    if (!isAlreadySelected) {
                      setSelectedObjectIds([object.id]);
                      setSelectedMemberIds([]);
                    }

                    const dragObjects = sceneObjects
                      .filter((item) => targetIds.includes(item.id))
                      .map((item) => ({
                        id: item.id,
                        x: item.x,
                        y: item.y,
                      }));

                    setDragInfo({
                      kind: "object",
                      startX: point.x,
                      startY: point.y,
                      objects: dragObjects,
                    });

                    setActivePanel("object");
                  }}
                  style={{
                    left: `${object.x}px`,
                    top: `${object.y}px`,
                    width: `${Math.max(36, objectSize)}px`,
                    height: `${Math.max(36, objectSize)}px`,
                    zIndex: Math.round(object.y) - 1,
                  }}
                >
                  <img
                    className="sceneObjectImage"
                    src={object.imageUrl}
                    alt={object.label}
                    draggable={false}
                    style={{
                      width: `${objectSize}px`,
                    }}
                  />
                </div>
              );
            })}

            {!isMapLoading &&
              partyMembers.map((member) => {
              const imageUrl = getMemberImageUrl(member);
              const isSelected = selectedMemberIds.includes(member.id);

              return (
                <div
                  key={member.id}
                  className={`stageCharacterHitbox ${isSelected ? "selected" : ""}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const stageElement = event.currentTarget.closest(".stage");
                    if (!stageElement) return;

                    const point = getStagePoint(event, stageElement);
                    const isAlreadySelected = selectedMemberIds.includes(member.id);
                    const targetIds = isAlreadySelected ? selectedMemberIds : [member.id];

                    rememberScene();

                    if (!isAlreadySelected) {
                      setSelectedMemberIds([member.id]);
                      setSelectedObjectIds([]);
                    }

                    const dragMembers = partyMembers
                      .filter((item) => targetIds.includes(item.id))
                      .map((item) => ({
                        id: item.id,
                        x: item.x,
                        y: item.y,
                      }));

                    setDragInfo({
                      kind: "member",
                      startX: point.x,
                      startY: point.y,
                      members: dragMembers,
                    });

                    setActivePanel("character");
                  }}
                  style={{
                    left: `${member.x}px`,
                    top: `${member.y}px`,
                    width: `${120 * member.scale}px`,
                    height: `${155 * member.scale}px`,
                    zIndex: Math.round(member.y),
                    "--member-scale": member.scale,
                  }}
                >
                  <img
                    className="stageCharacter"
                    src={imageUrl}
                    alt={member.characterName}
                    draggable={false}
                    style={{
                      width: `${300 * member.scale}px`,
                      height: `${300 * member.scale}px`,
                    }}
                  />
                  <div className="stageCharacterNameTag">
                    {member.characterName}
                  </div>
                </div>
              );
            })}
          </div>

          <section className="characterInfo">
            <h2>파티샷</h2>
            <p>
              <strong>맵</strong> {selectedMapPreset.label}
            </p>
            <p>
              <strong>캐릭터</strong> {partyMembers.length}명
            </p>
            <p>
              <strong>오브젝트</strong> {sceneObjects.length}개
            </p>
          </section>

          <section className="layerPanel">
            <div className="layerPanelHeader">
              <h3>레이어</h3>
              <span>{sceneLayers.length}개</span>
            </div>

            {sceneLayers.length === 0 ? (
              <p className="emptyText">캐릭터나 오브젝트를 추가하면 이곳에서 바로 선택하고 관리할 수 있습니다.</p>
            ) : (
              <div className="layerList">
                {sceneLayers.map((layer) => (
                  <div
                    key={`${layer.kind}-${layer.id}`}
                    className={`layerItem ${layer.selected ? "active" : ""}`}
                    onClick={() => selectLayer(layer)}
                  >
                    <div>
                      <strong>{layer.label}</strong>
                      <span>{layer.kind === "member" ? "캐릭터" : "오브젝트"} · {layer.meta}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeLayer(layer);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {sceneObjects.length > 0 && (
            <section className="objectList">
              {sceneObjects.map((object) => {
                const isSelected = selectedObjectIds.includes(object.id);

                return (
                  <div
                    key={object.id}
                    className={`objectCard ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedObjectIds([object.id]);
                      setSelectedMemberIds([]);
                      setActivePanel("object");
                    }}
                  >
                    <button
                      type="button"
                      className="memberRemoveButton"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSceneObject(object.id);
                      }}
                    >
                      ×
                    </button>

                    <strong>{object.label}</strong>
                    <span>{object.type}</span>
                  </div>
                );
              })}
            </section>
          )}

          {partyMembers.length > 0 && (
            <section className="memberList">
              <div className="memberListActions">
                <button type="button" onClick={selectAllMembers}>
                  전체 선택
                </button>
                <button type="button" onClick={clearSelectedMembers}>
                  선택 해제
                </button>
              </div>

              {partyMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className={`memberCard ${isSelected ? "active" : ""}`}
                    onClick={() => toggleMemberSelection(member.id)}
                  >
                    <button
                      type="button"
                      className="memberRemoveButton"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeMember(member.id);
                      }}
                    >
                      ×
                    </button>

                    <strong>{member.characterName}</strong>
                    <span>{member.characterClass}</span>
                  </div>
                );
              })}
            </section>
          )}
        </section>

        <aside className="controlPanel">
          <nav className="panelTabs">
            <button
              type="button"
              className={activePanel === "scene" ? "active" : ""}
              onClick={() => setActivePanel("scene")}
            >
              장면
            </button>
            <button
              type="button"
              className={activePanel === "object" ? "active" : ""}
              onClick={() => setActivePanel("object")}
            >
              오브젝트
            </button>
            <button
              type="button"
              className={activePanel === "character" ? "active" : ""}
              onClick={() => setActivePanel("character")}
            >
              캐릭터
            </button>
            <button
              type="button"
              className={activePanel === "export" ? "active" : ""}
              onClick={() => setActivePanel("export")}
            >
              저장
            </button>
          </nav>

          {activePanel === "scene" && (
            <section className="panelBody">
              <h3>장면 설정</h3>

              <label>맵 프리셋</label>
              <div className="mapPresetGrid">
                {SCENE_PRESETS.map((item) => {
                  const isActive = item.value === selectedMapValue;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`mapPresetCard ${isActive ? "active" : ""}`}
                      onClick={() => applyScenePreset(item.value)}
                    >
                      <span
                        className={`mapPresetThumbnail ${item.thumbnailUrl ? "" : "checker"}`}
                        style={
                          item.thumbnailUrl
                            ? { backgroundImage: `url(${item.thumbnailUrl})` }
                            : undefined
                        }
                      />
                      <span className="mapPresetMeta">
                        <strong>{item.label}</strong>
                        <em>{item.mapId ? `Map ${item.mapId}` : "기본 배경"}</em>
                      </span>
                    </button>
                  );
                })}
              </div>

              {hasBgm && (
                <div className="musicControlBox">
                  <div>
                    <strong>BGM</strong>
                    <span>{selectedMapPreset.bgmPath}</span>
                  </div>

                  <button
                    type="button"
                    className={isMusicOn ? "musicButton active" : "musicButton"}
                    onClick={toggleMusic}
                  >
                    {isMusicOn ? "음악 끄기" : "음악 켜기"}
                  </button>
                </div>
              )}

              {musicError && <p className="musicError">{musicError}</p>}

              <label>배경 이미지 업로드</label>
              <label className="uploadBox">
                <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
                <span className="uploadIcon">IMG</span>
                <span className="uploadText">
                  <strong>이미지 선택</strong>
                  <em>내 PC 이미지를 배경으로 사용</em>
                </span>
              </label>

              <label>배경 맞춤</label>
              <select
                value={backgroundFit}
                onChange={(event) => setBackgroundFit(event.target.value)}
              >
                <option value="cover">뷰포트 채우기</option>
                <option value="contain">전체 보이기</option>
              </select>

              {backgroundUrl && (
                <div className="backgroundControlBox">
                  <div className="scaleLabelRow">
                    <label>배경 확대: {backgroundZoom.toFixed(2)}x</label>

                    {Math.abs(backgroundZoom - selectedMapPreset.zoom) > 0.001 && (
                      <button
                        type="button"
                        className="scaleResetButton"
                        onClick={() => {
                          setBackgroundZoom(selectedMapPreset.zoom);
                          setBackgroundPositionX(selectedMapPreset.positionX);
                          setBackgroundPositionY(selectedMapPreset.positionY);
                        }}
                      >
                        원래대로
                      </button>
                    )}
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.05"
                    value={backgroundZoom}
                    onChange={(event) => setBackgroundZoom(Number(event.target.value))}
                  />

                  <label>배경 가로 위치: {backgroundPositionX}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={backgroundPositionX}
                    onChange={(event) =>
                      setBackgroundPositionX(Number(event.target.value))
                    }
                  />

                  <label>배경 세로 위치: {backgroundPositionY}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={backgroundPositionY}
                    onChange={(event) =>
                      setBackgroundPositionY(Number(event.target.value))
                    }
                  />
                </div>
              )}

              <button className="ghostButton" onClick={resetBackground}>
                배경 초기화
              </button>
            </section>
          )}

          {activePanel === "object" && (
            <section className="panelBody">
              <h3>오브젝트 / 몬스터</h3>

              <label>몬스터 프리셋</label>
              <select
                value={selectedObjectPresetValue}
                onChange={(event) => setSelectedObjectPresetValue(event.target.value)}
              >
                {OBJECT_PRESETS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                className="ghostButton"
                type="button"
                onClick={addSceneObjectFromPreset}
              >
                프리셋 추가
              </button>

              <div className="customObjectBox">
                <strong>몬스터 ID 직접 추가</strong>
                <span>mobId를 알고 있다면 바로 테스트할 수 있습니다.</span>

                <input
                  value={customObjectId}
                  onChange={(event) => setCustomObjectId(event.target.value)}
                  placeholder="예: 100100"
                />

                <input
                  value={customObjectName}
                  onChange={(event) => setCustomObjectName(event.target.value)}
                  placeholder="표시 이름"
                />

                <button type="button" onClick={addCustomMonster}>
                  ID로 추가
                </button>
              </div>

              {selectedObjectIds.length > 0 && (
                <>
                  <div className="scaleLabelRow">
                    <label>오브젝트 크기: {selectedObjectScale.toFixed(2)}x</label>

                    {Math.abs(selectedObjectScale - 1) > 0.001 && (
                      <button
                        type="button"
                        className="scaleResetButton"
                        onClick={() => updateSelectedObjects({ scale: 1 })}
                      >
                        원래대로
                      </button>
                    )}
                  </div>

                  <input
                    type="range"
                    min="0.3"
                    max="4"
                    step="0.05"
                    value={selectedObjectScale}
                    onChange={(event) =>
                      updateSelectedObjects({ scale: Number(event.target.value) })
                    }
                  />

                  <button
                    className="dangerButton"
                    type="button"
                    onClick={removeSelectedObjects}
                  >
                    선택 오브젝트 삭제
                  </button>
                </>
              )}
            </section>
          )}

          {activePanel === "character" && (
            <section className="panelBody">
              <h3>캐릭터 조절</h3>

              {!primarySelectedMember && (
                <p className="emptyText">
                  캐릭터 카드를 선택하면 개별 또는 일괄 설정을 바꿀 수 있습니다.
                </p>
              )}

              {primarySelectedMember && (
                <>
                  <div className="selectedName">
                    선택됨 {selectedMemberIds.length}명
                    <span>선택한 캐릭터 중 하나를 드래그하면 함께 이동합니다.</span>
                  </div>

                  <div className="alignTools">
                    <button type="button" onClick={alignSelectedBottom}>
                      바닥 정렬
                    </button>
                    <button type="button" onClick={landSelectedMembers}>
                      착지
                    </button>
                    <button type="button" onClick={distributeSelectedHorizontally}>
                      간격 정렬
                    </button>
                    <button type="button" onClick={spreadSelectedAcrossStage}>
                      전체 배치
                    </button>
                  </div>

                  <label>자세</label>
                  <select
                    value={primarySelectedMember.action}
                    onChange={(event) =>
                      updateSelectedMembers({ action: event.target.value })
                    }
                  >
                    {ACTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <label>감정</label>
                  <select
                    value={primarySelectedMember.emotion}
                    onChange={(event) =>
                      updateSelectedMembers({ emotion: event.target.value })
                    }
                  >
                    {EMOTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <label>무기 모션</label>
                  <select
                    value={primarySelectedMember.wmotion}
                    onChange={(event) =>
                      updateSelectedMembers({ wmotion: event.target.value })
                    }
                  >
                    {WEAPON_MOTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <div className="scaleLabelRow">
                    <label>크기: {primarySelectedMember.scale.toFixed(2)}x</label>

                    {Math.abs(primarySelectedMember.scale - 1) > 0.001 && (
                      <button
                        type="button"
                        className="scaleResetButton"
                        onClick={() => updateSelectedMembers({ scale: 1 })}
                      >
                        원래대로
                      </button>
                    )}
                  </div>

                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={primarySelectedMember.scale}
                    onChange={(event) =>
                      updateSelectedMembers({ scale: Number(event.target.value) })
                    }
                  />
                </>
              )}
            </section>
          )}

          {activePanel === "export" && (
            <section className="panelBody">
              <h3>내보내기</h3>

              <label>PNG 배율</label>
              <select
                value={exportScale}
                onChange={(event) => setExportScale(Number(event.target.value))}
              >
                <option value={1}>1x · 빠른 저장</option>
                <option value={2}>2x · 기본</option>
                <option value={4}>4x · 고해상도</option>
              </select>

              <label className="toggleRow">
                <input
                  type="checkbox"
                  checked={includeBackgroundInExport}
                  onChange={(event) => setIncludeBackgroundInExport(event.target.checked)}
                />
                <span>배경 포함</span>
              </label>

              <label className="toggleRow">
                <input
                  type="checkbox"
                  checked={transparentExport}
                  onChange={(event) => setTransparentExport(event.target.checked)}
                />
                <span>빈 배경을 투명하게 저장</span>
              </label>

              <div className="exportSummary">
                <strong>{STAGE_WIDTH * exportScale} × {STAGE_HEIGHT * exportScale}px</strong>
                <span>현재 스테이지 비율 그대로 PNG로 저장됩니다.</span>
              </div>
            </section>
          )}

          <div className="actionButtons">
            <button className="previewButton" onClick={openPreview}>
              확대 보기
            </button>

            <button className="downloadButton" onClick={downloadImage}>
              PNG 저장
            </button>
          </div>
        </aside>
      </section>

      {previewUrl && (
        <div className="previewModal" onClick={() => setPreviewUrl("")}>
          <div
            className="previewModalContent"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="previewClose" onClick={() => setPreviewUrl("")}>
              닫기
            </button>
            <img src={previewUrl} alt="확대 미리보기" />
          </div>
        </div>
      )}
    </main>
  );
}
