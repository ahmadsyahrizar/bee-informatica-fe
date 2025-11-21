export async function getCroppedImg(imageSrc: string, pixelCrop: { width: number; height: number; x: number; y: number; }) {
 const image = await createImage(imageSrc);
 const canvas = document.createElement("canvas");
 const outputSize = 400;
 canvas.width = outputSize;
 canvas.height = outputSize;
 const ctx = canvas.getContext("2d")!;
 ctx.fillStyle = "#fff";
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 // scale factor between natural image and displayed image: we rely on pixelCrop already in natural px
 ctx.drawImage(
  image,
  pixelCrop.x,
  pixelCrop.y,
  pixelCrop.width,
  pixelCrop.height,
  0,
  0,
  outputSize,
  outputSize
 );

 return new Promise<Blob>((resolve, reject) => {
  canvas.toBlob((blob) => {
   if (!blob) return reject(new Error("Canvas is empty"));
   resolve(blob);
  }, "image/jpeg", 0.9);
 });
}

function createImage(url: string): Promise<HTMLImageElement> {
 return new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = (e) => reject(e);
  img.src = url;
 });
}
