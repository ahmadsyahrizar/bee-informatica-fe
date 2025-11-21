export default function extractProfileKey(url: string): string | null {
 const marker = "profile_pictures";
 const index = url.indexOf(marker);

 if (index === -1) return null;

 return url.substring(index);
}
