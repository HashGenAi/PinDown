importScripts("https://cdn.jsdelivr.net/npm/heic2any/dist/heic2any.min.js");

onmessage = async (e) => {
  const files = e.data;

  for(const file of files){
    try{
      const pngBlob = await heic2any({
        blob: file,
        toType: "image/png",
        quality: 1
      });

      postMessage({
        blob: pngBlob,
        name: file.name.replace(/\.(heic|heif)$/i, ".png")
      });
    }catch(err){
      console.error(err);
    }
  }

  postMessage({ done:true });
};
