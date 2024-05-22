import styles from './UserInfo.module.scss';
import { Avatar } from '@mui/material';

interface UserInfoProps {
  avatarUrl: string
  fullName: string
  additionalText: string
}

export const UserInfo = ({ avatarUrl, fullName, additionalText }: UserInfoProps) => {
  const date = new Date(additionalText)
  const formattedDate = date.toLocaleDateString('ru', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  
  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src={avatarUrl || '.'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{formattedDate}</span>
      </div>
    </div>
  );
};
