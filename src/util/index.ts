export function getFormat(name: string): string {
  const index = name.lastIndexOf(".");
  return name.substring(index + 1, name.length).toLowerCase();
}
export function spaceSizeMini(value: number) {
  if (!value) {
    return "";
  }
  if (value >= 1024 * 1024 * 1024) {
    return `${(value / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  } else if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(0)} MB`;
  } else {
    return `${(value / 1024).toFixed(0)} KB`;
  }
}

export function setIcon(type: string): string {
  let icon = "iconfont icon-file";
  switch (type) {
    case "pdf":
      icon = "iconfont icon-pdf";
      break;
    case "jpg":
    case "jpeg":
    case "jpe":
    case "png":
    case "gif":
    case "jfif":
      icon = "iconfont icon-image";
      break;
    case "mp4":
      icon = "iconfont icon-video";
      break;
    case "zip":
    case "7z":
    case "rar":
      icon = "iconfont icon-zip";
      break;
    case "mp3":
    case "m4a":
      icon = "iconfont icon-music";
      break;
    case "doc":
    case "docx":
      icon = "iconfont icon-doc";
      break;
    case "xsl":
    case "xslx":
      icon = "iconfont icon-xsl";
      break;
    case "ppt":
    case "pptx":
      icon = "iconfont icon-ppt";
      break;
    case "html":
      icon = "iconfont icon-html";
      break;

    default:
      break;
  }
  return icon;
}

export function IsImage(type: string): boolean {
  type = type.toLowerCase();
  return ["jpg", "jpeg", "jpe", "png", "gif", "jfif"].includes(type);
}

export function getAllImages(list: { type: string; name: string }[], currentURL: string) {
  return list.filter((item) => IsImage(item.type)).map((item) => `${currentURL}${item.name}`);
}

export function getRealPath(path, isFile) {
  let p = "";
  if (path instanceof Array) {
    p = path.join("/");
  } else {
    p = path as string;
  }
  return p ? (isFile ? `/${p}` : `/${p}/`) : "/";
}

export function rafThrottle(fn) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(window, args);
      locked = false;
    });
  };
}
