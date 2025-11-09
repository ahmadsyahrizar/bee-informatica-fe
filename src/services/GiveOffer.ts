import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { PostGiveOfferRequest } from "@/types/api/post-give-offer.type";

type PropsPostGiveOffer = {
 accessToken: string;
 caseId: string | number;
 body: PostGiveOfferRequest;
};

const PostGiveOffer = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostGiveOffer) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/give-offer`,
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

export default PostGiveOffer;
