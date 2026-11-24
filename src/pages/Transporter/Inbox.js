import React from 'react';
import ChatContainer from '../../components/ChatContainer';
import { useAuth0 } from '../../auth/AuthContext';

const TransporterInbox = () => {
  const { user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return <ChatContainer currentUserId={user.sub} />;
};

export default TransporterInbox;
