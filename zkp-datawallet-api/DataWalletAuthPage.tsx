import { base64ToBytes } from '@0xpolygonid/js-sdk';
import Loading from '@components/Shared/Loading';
import {
  approveMethod,
  //invokeContractMethod,
  proofMethod,
  receiveMethod
} from '@pages/api/did/Approve.service';
import { ExtensionService } from '@pages/api/did/Extension.service';
import { onUserClaimingReward, onUserClaimProofed } from '@store/signals';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSignalValue } from 'signals-react-safe';
import { useUpdateEffect } from 'usehooks-ts';

interface InfoDataWalletAuth {
  accounts: any;
  currentAccount: any;
  packageMgr: any;
  dataStorage: any;
}

const RequestType = {
  Auth: 'auth',
  CredentialOffer: 'credentialOffer',
  Proof: 'proof',
  ProofContractInvokeRequest: 'proofContractInvokeRequest'
};

const getTitle = (requestType: any) => {
  switch (requestType) {
    case RequestType.Auth:
      return 'Authorization';
    case RequestType.CredentialOffer:
      return 'Receive Claim';
    case RequestType.Proof:
      return 'Proof request';
    case RequestType.ProofContractInvokeRequest:
      return 'Proof Contract Request';
    default:
      return '';
  }
};

const DataWalletAuthPage: FC<InfoDataWalletAuth> = (props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<any>();
  const [payload, setPayload] = useState<any>();
  const { accounts, packageMgr, dataStorage } = props;
  //const searchParams = useSearchParams();
  //const search = searchParams.get('search');
  const pathname = usePathname();
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState<any>('');
  const [msgBytes, setMsgBytes] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [isReady, setIsReady] = useState(true);
  const [originalUrl, setOriginalUrl] = useState(null);

  const urlData = query;
  let dataType = data?.type;

  const isClaimProofed = useSignalValue(onUserClaimProofed);

  const detectRequest = (unpackedMessage: any) => {
    const { type, body } = unpackedMessage;
    const { scope = [], transaction_data } = body;

    //console.log('unpackedMessage ==>', type, body);
    //console.log('SCOPE ==>', scope, body, transaction_data);

    if (type.includes('request') && scope.length && transaction_data === null) {
      return RequestType.Proof;
    } else if (type.includes('contract') && transaction_data !== null) {
      return RequestType.ProofContractInvokeRequest;
    } else if (type.includes('offer')) {
      return RequestType.CredentialOffer;
    } else if (type.includes('request')) {
      return RequestType.Auth;
    }
  };

  async function handleClickReject() {
    router.back();
    setOpen(false);
  }

  async function handleClickApprove() {
    setIsReady(false);
    const result = await approveMethod(msgBytes);
    if (result.code !== 'ERR_NETWORK') {
      //router.back();
      setOpen(false);
    } else {
      setError(result.message);
      setIsReady(true);
      setOpen(false);
    }
  }

  async function handleClickProof() {
    setIsReady(false);
    try {
      await proofMethod(msgBytes);
      //router.back();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickContractProof() {
    setIsReady(false);
    try {
      //await invokeContractMethod(originalUrl);
      setIsReady(false);
      //router.back();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickReceive() {
    setIsReady(false);
    if (msgBytes.length > 0) {
      let result = await receiveMethod(msgBytes);

      /*.catch((error) => {
        console.log('ERROR:', error);
        onUserClaimingReward.value = 'NO-CLAIM'
        setError(error);
        router.push(window.location.href)
      });*/
      onUserClaimingReward.value = 'NO-CLAIM';

      if (result === 'SAVED') {
        //router.push('/');
        setOpen(false);
        setTimeout(() => {
          onUserClaimingReward.value = 'NO-CLAIM';
          //Router.reload();
          //router.back();
        }, 2000);
      } else {
        //setError(result.message);
        onUserClaimingReward.value = 'NO-CLAIM';
        setIsReady(true);
      }
    }
  }

  const getCredentialRequestData = () => {
    const { body } = data;
    const { scope = [] } = body;
    return scope.map(({ circuitId, query }: any) => {
      let data = [];
      data.push({
        name: 'Credential type',
        value: query.type
      });
      query.credentialSubject &&
        data.push({
          name: 'Requirements',
          value: Object.keys(query.credentialSubject).reduce((acc, field) => {
            const filter = query.credentialSubject[field];
            const filterStr: any = Object.keys(filter).map((operator) => {
              return `${field} - ${operator} ${filter[operator]}\n`;
            });
            return acc.concat(filterStr);
          }, '')
        });
      data.push({
        name: 'Allowed issuers',
        value: query.allowedIssuers.join(', ')
      });
      data.push({
        name: 'Proof type',
        value: circuitId
      });
      return data;
    });
  };

  useEffect(() => {
    document.addEventListener('authEvent', function (e: any) {
      console.log('URL ===> ', e.detail);
      console.log('QUERY ===> ', e.detail.split('i_m=')[1]);

      setData(
        e.detail.includes('?i_m=')
          ? { type: 'base64', payload: e.detail.split('?i_m=')[1] }
          : {
              type: 'link',
              payload: decodeURIComponent(e.detail.split('?request_uri=')[1])
            }
      );

      setQuery(e.detail.split('i_m=')[1]);
      setOpen(true);
    });
  }, [dataStorage, packageMgr, data, isClaimProofed]);

  useUpdateEffect(() => {
    // get active account
    //let accounts = JSON.parse(localStorage.getItem('accounts'));
    let accountActive = accounts.filter((acc: any) => acc.isActive);
    console.log('accounts ==>', accountActive);
    console.log('onUserClaimProofed ==>', isClaimProofed);
    setCurrentAccount(accountActive[0]?.did);

    let ignore = false;
    const { packageMgr, dataStorage } =
      ExtensionService.getExtensionServiceInstance();
    const fetchData = async () => {
      let msgBytes;
      console.log('DATA###########', data);
      if (data?.payload !== undefined && data !== null) {
        if (dataType === 'base64') {
          msgBytes = base64ToBytes(data.payload);
        } else {
          msgBytes = await fetch(decodeURIComponent(data.payload))
            .then((res) => res.arrayBuffer())
            .then((res) => new Uint8Array(res));
        }
        if (msgBytes.length > 0) {
          console.log('msgBytes ######### ', msgBytes);
          const { unpackedMessage } = await packageMgr.unpack(msgBytes);
          setMsgBytes(msgBytes);

          if (!ignore) {
            console.log('unpackedMessage', unpackedMessage);
            setData(unpackedMessage);
            setRequestType(detectRequest(unpackedMessage));
          }
        }
      }
    };

    dataStorage.identity
      .getAllIdentities()
      .then((_identity: any) => {
        if (_identity.length <= 0) {
          //navigate("/welcome", { state: pathname + search });
        } else {
          fetchData().catch(console.error);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };

    // fix twice call
    /*let ignore = false;
    const fetchData = async () => {
      if (query) {
        const msgBytes = byteEncoder.encode(Base64.decode(query));
        const { unpackedMessage } = await packageMgr.unpack(msgBytes);
        if (!ignore) {
          console.log('unpackedMessage', unpackedMessage);
          setOriginalUrl(query);
          setData(unpackedMessage);
          setRequestType(detectRequest(unpackedMessage));
        }
      }
    };

    dataStorage?.identity
      .getAllIdentities()
      .then((_identity: any) => {
        if (_identity.length <= 0) {
          //navigate("/welcome", { state: pathname + search });
        } else {
          fetchData().catch(console.error);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };*/

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, accounts, data]);

  useUpdateEffect(() => {
    if (isReady && requestType && requestType === RequestType.CredentialOffer) {
      setOpen(true);
      console.log('handleClickReceive() ===================:>>>');
      try {
        handleClickReceive();
        onUserClaimingReward.value = 'NO-CLAIM';
        parent.window.dispatchEvent(new Event('claimreceived'));
        return;
      } catch (error: any) {
        onUserClaimingReward.value = 'NO-CLAIM';
        console.log(error);
      }
    }

    if (isReady && requestType && requestType === RequestType.Proof) {
      setOpen(true);
      console.log('handleClickProof() ===================:>>>');
      try {
        handleClickProof();
        return;
      } catch (error: any) {
        console.log(error);
      }
    }

    if (
      isReady &&
      requestType &&
      requestType === RequestType.ProofContractInvokeRequest
    ) {
      setOpen(true);
      console.log('handleClickContractProof() ===================:>>>');
      try {
        handleClickContractProof();
        return;
      } catch (error: any) {
        console.log(error);
      }
    }

    if (isReady && requestType && requestType === RequestType.Auth) {
      setOpen(true);
      console.log('handleClickApprove() ===================:>>>');
      try {
        handleClickApprove();
        return;
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [
    isReady,
    requestType,
    query,
    accounts,
    dataStorage,
    msgBytes,
    onUserClaimingReward
  ]);

  return requestType && open ? <Loading /> : null;
};

export default DataWalletAuthPage;
