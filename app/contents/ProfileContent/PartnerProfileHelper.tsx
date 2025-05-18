import React,{useState,useEffect} from 'react';
import PartnerInvite from './PartnerInvite';
import PartnerProfile from './ProfileMainPage';

interface ProfilePageWrapperProps {
    id: number;
    partner_id?: number | null; // allow null and undefined
}
interface partnerData {
  userID: number;
  username: string;
  email: string;
  password: string;
  gold: number;
  ruby: number;
  description: string | null;
  buddy: number| null;
}

const ProfilePageWrapper: React.FC<ProfilePageWrapperProps> = ({ id, partner_id }) => {
    const hasPartner = partner_id != null;
    const [partnerData, setPartnerData] = useState<partnerData | null>(null);

    useEffect(() => {
            fetch("http://192.168.1.5:8081/api/user/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userID:partner_id }),
            })
        
            .then(async (response) => {
              const text = await response.text(); // Read raw response
              // console.log("Raw response:", text);
              return JSON.parse(text);
            })
        
            .then((data) => {
              // console.log("Fetched user data:", data);
              setPartnerData(data);
            })
        
              .catch((error) => console.error("Error fetching user data:", error));
            
        }, [partner_id]); // Runs when `user` changes

    return hasPartner
        ? <PartnerProfile userid={partner_id} 
        username={partnerData?.username}
        hashtag= {`#${partnerData?.userID}`}
        description={partnerData?.description ?? ""}
        partner={partnerData?.buddy ?? undefined}/>

        : <PartnerInvite userID={id} />;
};

export default ProfilePageWrapper;
