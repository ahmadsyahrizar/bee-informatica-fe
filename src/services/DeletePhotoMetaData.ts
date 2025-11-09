import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsDeletePhoto } from "@/types/api/photo.type";

const DeletePhotoMetaData = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsDeletePhoto) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/photo`,
  {
   method: "DELETE",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default DeletePhotoMetaData;  