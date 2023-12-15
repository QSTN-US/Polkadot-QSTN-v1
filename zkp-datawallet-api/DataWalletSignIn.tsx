//import DataWalletAuthPage from '@components/DataWallet/DataWalletAuthPage';
import Loading from '@components/Shared/Loading';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { Mixpanel } from '@lib/mixpanel';
import { PAGEVIEW } from '@lib/tracking';
import { delay, encrypt } from '@lib/utils';
import {
  ACCESS_TOKEN_SECRET,
  API_SERVER_URL,
  API_URL
} from '@qstn/data/constants';
import type { Wallet } from '@qstn/graphql';
import { useUserWalletLazyQuery } from '@qstn/graphql';
import { useAppPersistStore, useAppStore } from '@store/app';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateEffect } from 'usehooks-ts';
import * as yup from 'yup';

// validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter a valid email Address')
});

/*
const DataWalletAuthPage = dynamicLoader(
  () => import('@components/DataWallet/DataWalletAuthPage'),
  {
    //loading: () => <Loading />,
    ssr: false
  }
);*/

const DataWalletSignIn: NextPage = () => {
  const { handleLogin, accessToken, refreshToken } = useAuth();

  const [magic, setMagic] = useState<any>();
  const [authRequest, setAuthRequest] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPoolingAuthResponse, setIsPoolingAuthResponse] = useState<boolean>();
  const setUsers = useAppStore((state) => state.setUsers);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const setIssuerId = useAppPersistStore((state) => state.setIssuerId);
  const setIssuerIden3 = useAppPersistStore((state) => state.setIssuerIden3);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setProfileDisplayName = useAppPersistStore(
    (state) => state.setProfileDisplayName
  );
  const setProfileType = useAppPersistStore((state) => state.setProfileType);
  const setProfileAvatar = useAppPersistStore(
    (state) => state.setProfileAvatar
  );

  const setProfileStatus = useAppPersistStore(
    (state) => state.setProfileStatus
  );
  const currentProfileType = useAppPersistStore((state) => state.profileType);
  const currentProfileStatus = useAppPersistStore(
    (state) => state.profileStatus
  );
  const currentProfileId = useAppPersistStore((state) => state.profileId);
  const setWallet = useAppPersistStore((state) => state.setWallet);
  const [
    getUserWallet,
    { error: errorUserWallet, loading: loadingUserWallet }
  ] = useUserWalletLazyQuery({
    fetchPolicy: 'no-cache'
  });

  const serverUrl = API_URL;
  const router = useRouter();

  const creditUserWalletBalance = async (profileId: string, amount: number) => {
    try {
      const { data } = await axios.post(`${API_SERVER_URL}/near/ansrcredit`, {
        profileId: profileId,
        amount: amount
      });
      const qstn_balance = data.data?.newbalance;
      return qstn_balance;
    } catch (error: any) {
      console.log(error);
    }
  };

  const getAuthRequest = async () => {
    const apiUrl = `${API_SERVER_URL}/did/sign-in`;

    try {
      const response = await axios.get(apiUrl);
      console.log('getAuthRequest ==>', response.data);
      if (response.data?.id) {
        //success
        setAuthRequest(response.data);
      }
      return response.data;
    } catch (error: any) {
      console.error('Error not did data:', error);
    }

    return false;
  };

  const getAuthStatus = async () => {
    const sessionId = Number(
      `${authRequest?.body?.callbackUrl}`.split('sessionId=')[1]
    );
    const apiUrl = `${API_SERVER_URL}/did/status?sessionId=${sessionId}`;

    try {
      const response = await axios.get(apiUrl);
      console.log('getAuthStatus ==>', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error not did data:', error);
    }

    return false;
  };

  const setAuthSession = async (authResponse: any) => {
    const apiUrl = `${API_URL}/auth/session`;
    console.log('setAuthSession ==>', apiUrl);
    try {
      const response = await axios.post(apiUrl, { authResponse });
      console.log('setAuthSession ==>', response.data);
      sessionStorage.setItem(
        'AUTH',
        JSON.stringify(response.data?.result.AUTH)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error session not saved:', error);
    }

    return false;
  };

  const walletLogin = async (id: string, didToken: string) => {
    const result = await fetch(`${serverUrl}/user/login`, {
      headers: new Headers({
        Jwz: 'Bearer ' + didToken
      }),
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({
        email: id
      }) as any
    });

    return result.json();
  };

  const poolingAuthResponse = async () => {
    let auth;
    while (true) {
      auth = await getAuthStatus();
      console.log('poolingAuthResponse ==>', auth);
      if (auth?.id) {
        //await setAuthSession(auth)
        console.log('Wallet is logged ==>', auth?.id);
        sessionStorage.setItem('AUTH', JSON.stringify(auth));
        const isLogged = await walletLogin(auth?.id, auth?.jwz);
        console.log('isLogged ==>', isLogged);
        if (!isLogged.user) {
          setProfileId('0');
          setProfileType('UNKNOWNWALLET');
          setProfileStatus('PENDING');

          Cookies.set(
            '-qstn.ulvl',
            encrypt(ACCESS_TOKEN_SECRET as string, 'UNKNOWNWALLET'),
            {
              secure: true,
              sameSite: 'None'
            }
          );

          // set user status cookie
          Cookies.set(
            '-qstn.ustatus',
            encrypt(ACCESS_TOKEN_SECRET as string, 'PENDING'),
            {
              secure: true,
              sameSite: 'None'
            }
          );

          router.push('/');
          return;
        }

        const { user, logged } = isLogged;
        const handledLogin = logged
          ? await handleLogin(logged.email, logged.signature)
          : null;
        setCurrentUser(user);
        setProfileId(user.profileId);
        setProfileDisplayName(user.displayName);
        setProfileType(user.accountType);
        setProfileStatus(user.accountStatus);
        user?.avatar && setProfileAvatar(user.avatar);
        setIssuerId(user.issuer);
        setIssuerIden3(user.iden3issuer);
        //console.log("isLogged", isLogged);

        Cookies.set(
          '-qstn.ulvl',
          encrypt(ACCESS_TOKEN_SECRET as string, user.accountType),
          {
            secure: true,
            sameSite: 'None'
          }
        );

        // set user status cookie
        Cookies.set(
          '-qstn.ustatus',
          encrypt(ACCESS_TOKEN_SECRET as string, user.accountStatus),
          {
            secure: true,
            sameSite: 'None'
          }
        );

        const updateWallet = async () => {
          const { data: userWalletData } = await getUserWallet({
            variables: {
              request: {
                profileId: user.profileId
              }
            }
          });
          //console.log(usersData);
          if (userWalletData) {
            setWallet(userWalletData.userWallet as Wallet);
          }
        };
        updateWallet();

        if (
          user.accountStatus === 'PENDING' &&
          user.accountType === 'ENDUSER'
        ) {
          // set user status cookie
          Cookies.set(
            '-qstn.onboarding',
            encrypt(ACCESS_TOKEN_SECRET as string, '/onboarding/user/tutorial'),
            {
              secure: true,
              sameSite: 'None'
            }
          );
          await creditUserWalletBalance(String(user.profileId), 5);
        }
        // check user status and onboarding status
        /*if (user.accountStatus === 'PENDING') {
          router.push(
            redirectUser({
              accountStatus: user.accountStatus,
              onboardingStatus: OnBoardingStatus.Pending
            })
          );
        }*/

        // check user status and onboarding status
        if (user.accountStatus === 'PENDING') {
          if (user.accountType === 'BUSINESS') {
            router.push('/business');
          } else if (user.accountType === 'ENDUSER') {
            router.push('/onboarding/thankyou-signin');
          } else {
            router.push('/onboarding/type');
          }
        } else {
          if (user.accountType === 'BUSINESS') {
            router.push('/business');
          } else {
            console.log('SIGNIN -> redirect to onboarding survey step');
            router.push('/survey-marketplace');
          }
        }

        // onboarding tutorial survey pending
        // -> redirect to onboarding survey step

        // onboarding tutorial survey complete
        // -> redirect to onboarding survey reward notification step

        // onboading near wallet selection/skip pending
        // -> redirect to onboarding wallet selection step

        // onboarding onboarding status complete
        // -> redirect to survey marketplace
        //TODO
        //router.push("/survey-marketplace");

        break;
      }

      await delay(3000);
    }
  };

  const fetchData = async () => {
    await getAuthRequest();
  };

  useEffect(() => {
    fetchData();
    Mixpanel.track(PAGEVIEW, { page: 'wallet auth page' });
  }, []);

  useEffect(() => {
    console.log('authRequest', authRequest);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, touchedFields }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  /*const submitForm: any = async (formData: any) => {
    setLoading(true);
    try {
      const isLogged = await walletLogin();
      const { user, logged } = isLogged;

      const handledLogin = await handleLogin(logged.email, logged.signature);
      //console.log(handledLogin);
      //localStorage.setItem("accessToken", logged.accessToken);
      //localStorage.setItem("refreshToken", logged.refreshToken);
      //Cookies.set('accessToken', logged.accessToken, { secure: true, sameSite: 'strict' });
      //Cookies.set('refreshToken', logged.refreshToken, { secure: true, sameSite: 'strict' });

      setCurrentUser(user);
      setProfileId(user.profileId);
      setProfileDisplayName(user.displayName);
      setProfileType(user.accountType);
      setProfileStatus(user.accountStatus);
      user?.avatar && setProfileAvatar(user.avatar);
      setIssuerId(user.issuer);
      //console.log("isLogged", isLogged);

      const updateWallet = async () => {
        const { data: userWalletData } = await getUserWallet({
          variables: {
            request: {
              profileId: user.profileId,
            },
          },
        });
        //console.log(usersData);
        if (userWalletData) setWallet(userWalletData.userWallet as Wallet);
      };
      updateWallet();

      // check user status and onboarding status
      if (user.accountStatus === "PENDING") {
        router.push(
          redirectUser({
            accountStatus: user.accountStatus,
            onboardingStatus: OnBoardingStatus.Pending,
          })
        );
      }

      // check user status and onboarding status
      if (user.accountStatus === "PENDING" && user.accountType === "BUSINESS") {
        router.push("/onboarding/business");
      }


      // onboarding tutorial survey pending
      // -> redirect to onboarding survey step

      // onboarding tutorial survey complete
      // -> redirect to onboarding survey reward notification step

      // onboading near wallet selection/skip pending
      // -> redirect to onboarding wallet selection step

      // onboarding onboarding status complete
      // -> redirect to survey marketplace
      //TODO
      router.push("/survey-marketplace");
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };*/

  const signInClick = async (jsonData: any) => {
    //const currCaller = ? "iden3comm://" : window.location;
    const currCaller = 'iden3comm://';
    const t = `${currCaller}?i_m=${
        jsonData ? btoa(JSON.stringify(jsonData)) : ''
      }`,
      i = new CustomEvent('authEvent', {
        detail: t
      });

    window.document.dispatchEvent(i);
    //, (window.document.location.href = t);
    setIsPoolingAuthResponse(true);
    await poolingAuthResponse();
  };

  useUpdateEffect(() => {
    if (authRequest) {
      signInClick(authRequest);
    }
  }, [authRequest]);

  return authRequest && !isPoolingAuthResponse ? <Loading /> : null;
};

export default DataWalletSignIn;
