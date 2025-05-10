import React from 'react';
import PartnerInvite from './PartnerInvite';
import PartnerProfile from './ProfileMainPage';

interface ProfilePageWrapperProps {
    id: number;
}

const ProfilePageWrapper: React.FC<ProfilePageWrapperProps> = ({ id }) => {
  const hasPartner = id === 123; // placeholder condition

    return hasPartner ? <PartnerProfile userid={321}></PartnerProfile> : <PartnerInvite userID='321'></PartnerInvite>;
};

export default ProfilePageWrapper;
