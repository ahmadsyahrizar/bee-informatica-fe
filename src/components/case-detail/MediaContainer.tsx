import useCaseDetail from "@/hooks/useCaseDetail";
import { useParams } from "next/navigation";
import { SocialMedia } from "./SocialMedia";
import { PhotosSection } from "./media/photoSection";
import { OtherDocumentsSection } from "./media/otherDocuments";
import { SocialMediaDataResponse } from "@/types/api/social-media.type";

const MediaContainer = () => {
 const { id } = useParams();
 const { data } = useCaseDetail<SocialMediaDataResponse>({ type: "social_media", caseId: id as string });
 const fbUrl = data?.facebook_url || "";
 const igUrl = data?.instagram_url || "";
 const photos = data?.photos || [];
 const documents = data?.other_docs || [];
 console.log({ documents });

 return (
  <div>
   <SocialMedia facebookProfileUrl={fbUrl} instagramProfileUrl={igUrl} />

   {/* pass id so PhotosSection can call upload endpoints */}
   <PhotosSection photos={photos} caseId={id as string} />

   <OtherDocumentsSection documents={documents} />
  </div>
 );
};

export default MediaContainer;
