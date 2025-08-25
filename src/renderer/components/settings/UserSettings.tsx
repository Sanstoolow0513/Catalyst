import React from 'react';
import styled from 'styled-components';
import { Input, Label, FormGroup } from '../common';
import { User as UserIcon, Upload as UploadIcon } from 'lucide-react';

const UserSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.gradient.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: ${props => props.theme.shadow.cardHover};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.gradient.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: ${props => props.theme.shadow.card};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

interface UserSettingsProps {
  userEmail: string;
  userNickname: string;
  userAvatar: string | null;
  onUserEmailChange: (value: string) => void;
  onUserNicknameChange: (value: string) => void;
  onUserAvatarChange: (value: string | null) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  userEmail,
  userNickname,
  userAvatar,
  onUserEmailChange,
  onUserNicknameChange,
  onUserAvatarChange
}) => {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUserAvatarChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UserSectionContainer>
      <FormGroup>
        <Label>头像</Label>
        <AvatarContainer>
          <Avatar>
            {userAvatar ? (
              <img src={userAvatar} alt="User avatar" />
            ) : (
              <UserIcon size={48} color={props => props.theme.iconColor.default} />
            )}
          </Avatar>
          <UploadButton>
            <UploadIcon size={16} />
            上传头像
            <HiddenInput 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload}
            />
          </UploadButton>
        </AvatarContainer>
      </FormGroup>

      <FormGrid>
        <FormGroup>
          <Label>昵称</Label>
          <Input
            value={userNickname}
            onChange={(e) => onUserNicknameChange(e.target.value)}
            placeholder="输入您的昵称"
          />
        </FormGroup>

        <FormGroup>
          <Label>邮箱</Label>
          <Input
            type="email"
            value={userEmail}
            onChange={(e) => onUserEmailChange(e.target.value)}
            placeholder="输入您的邮箱地址"
          />
        </FormGroup>
      </FormGrid>
    </UserSectionContainer>
  );
};

export default UserSettings;