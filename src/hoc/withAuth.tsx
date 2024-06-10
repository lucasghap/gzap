import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function withAuth(WrappedComponent: React.FC): React.FC {
  return function WrappedWithAuth(props) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [hasAccessToken, setHasAccessToken] = useState<boolean | null>(null);

    useEffect(() => {
      setIsClient(true);

      if (typeof window !== 'undefined') {
        const accessToken = sessionStorage.getItem('tkn_gzap');
        setHasAccessToken(accessToken !== null);

        if (accessToken === null) {
          router.replace('/');
        } else {
          let duration = 1800;
          const login = '/?redirected';

          const resetTimer = () => {
            duration = 1800;
          };

          const updateTimer = () => {
            duration--;
            if (duration < 1) {
              Router.replace(login);
            }
          };

          const intervalId = setInterval(updateTimer, 1000);

          return () => {
            window.removeEventListener('mousemove', resetTimer);
            clearInterval(intervalId);
          };
        }
      }
    }, [router]);

    if (!isClient || hasAccessToken === null) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
