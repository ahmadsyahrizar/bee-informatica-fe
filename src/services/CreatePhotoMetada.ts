import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsCreatePhoto } from "@/types/api/photo.type";

const CreatePhotoMetaData = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsCreatePhoto) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/photo`,
  {
   method: "POST",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default CreatePhotoMetaData;  