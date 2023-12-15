import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
// Create a map to store the auth requests and their session IDs
import {auth, resolver, loaders} from '@iden3/js-iden3-auth'
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const APP_DIR = process.env.API_ZKPCIRCUITS_PATH;
const API_SERVER_URL = process.env.API_SERVER_URL;
const API_ISSUER_URL = process.env.API_ISSUER_URL;
const requestMap = new Map();
const responseMap = new Map();
const challengeMap = new Map();
let sessionId = 1;
//let challengeId = 1;

const issueAgeClaim = async (did: string, toAddress: string, birthday: number, documentType: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json",
        type: "KYCAgeCredential",
        credentialSubject: {
          id: toAddress,
          birthday: birthday,
          documentType: documentType
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}


const issueageclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, birthday, documentType, profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !birthday || !documentType || !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueAgeClaim(idid, toAddress, birthday, documentType, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}


const issueCountryOfResidenceClaim = async (did: string, toAddress: string, countryCode: number, documentType: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCCountryOfResidenceCredential-v2.json",
        type: "KYCCountryOfResidenceCredential",
        credentialSubject: {
          id: toAddress,
          countryCode: countryCode,
          documentType: documentType
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}


const issuecountryclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, countryCode, documentType, profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !countryCode || !documentType || !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueCountryOfResidenceClaim(idid, toAddress, countryCode, documentType, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}


const issueProofOfWorkClaim = async (did: string, toAddress: string, surveyId: number, resultsId: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-work/json/proof-of-work.json",
        type: "ProofOfWorkClaim",
        credentialSubject: {
          id: toAddress,
          surveyId: surveyId,
          resultsId: resultsId,
          profileId: profileId,
          entryDate: new Date().toISOString()
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}


const issueclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, surveyId, resultsId, profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !surveyId || !resultsId || !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueProofOfWorkClaim(idid, toAddress, surveyId, resultsId, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}


const issueProofOfBoostClaim = async (did: string, toAddress: string, orderId: number, typeBoost: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-boost/json/proof-of-boost.json",
        type: "ProofOfBoostClaim",
        credentialSubject: {
          id: toAddress,
          orderId: orderId,
          typeBoost: typeBoost,
          profileId: profileId,
          entryDate: new Date().toISOString()
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}



const issueboostclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, orderId, typeBoost, profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !orderId || !typeBoost|| !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueProofOfBoostClaim(idid, toAddress, orderId, typeBoost, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}



const issueProofOfPurchaseClaim = async (did: string, toAddress: string, orderId: number, productId: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/QSTN-US/qstn-zkp-schemas/main/credential-schema/proof-of-purchase/json/proof-of-purchase.json",
        type: "ProofOfPurchaseClaim",
        credentialSubject: {
          id: toAddress,
          orderId: orderId,
          productId: productId,
          profileId: profileId,
          entryDate: new Date().toISOString()
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}



const issuepurchaseclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, orderId, productId, profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !orderId || !productId|| !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueProofOfPurchaseClaim(idid, toAddress, orderId, productId, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}



const issueProofOfPremiumClaim = async (did: string, toAddress: string, orderId: number, profileId: number) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims`;

  try {
    const response = await axios.post(apiUrl, {
        credentialSchema: "https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-premium/json/proof-of-premium.json",
        type: "ProofOfPremiumClaim",
        credentialSubject: {
          id: toAddress,
          orderId: orderId,
          profileId: profileId,
          entryDate: new Date().toISOString()
        }
        //expiration: 1685899870
    });
    console.log('response claim ==>', response)
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('issued claim ==>', response.data)
      return response.data;
    }
    
  } catch (error: any) {
    console.error("Error not claim issued:", error);
  }

  return false;
}



const issuepremiumclaim = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toAddress, orderId,  profileId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!toAddress || !orderId || !profileId ) {
    throw new Error('No info to created claim ID provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No info to created claim ID provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
    const idid = process.env.API_ISSUER_DID;
    const issuedClaim = await issueProofOfPremiumClaim(idid, toAddress, orderId, profileId);

    res.status(200).json(issuedClaim);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }

}


const getClaimIdQrCode = async (did: string, claimId: string) => {
  const apiUrl = `${API_ISSUER_URL}/${encodeURIComponent(did)}/claims/${claimId}/qrcode`;
  try {
    const response = await axios.get(apiUrl);
    if (response.data) {
      //success
      //setAuthRequest(response.data);
      console.log('QRCode ==>', response.data)
    }
    return response.data;
  } catch (error: any) {
    console.error("Error not claim found:", error);
  }

  return false;
}

const qrcode = async (req: NextApiRequest, res: NextApiResponse) => {
  const { claimId, to } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

    if (!claimId || !to) {
      throw new Error('No result claim ID provided');
      const errorResponse = {
        statusCode: 500,
        message: 'No result claim ID provided' || 'An error occurred',
        success: false,
      };
      res.status(500).json(errorResponse);
    }

    try {
      const idid = process.env.API_ISSUER_DID;
      const qrcodeClaim = await getClaimIdQrCode(idid, claimId)
      //qrcodeClaim?.body?.credentials[0]?.description = `${qrcodeClaim?.body?.credentials[0]?.description}`.split('#')[1]

      // Add request claim proof
      const claimRequest = {
        id: claimId,
        thid: claimId,
        typ: "application/iden3comm-plain-json",
        type: "https://iden3-communication.io/credentials/1.0/offer",
        from: idid,
        to: to,
        body: {
          credentials: [
              {
                  description: `${qrcodeClaim?.body?.credentials[0]?.description}`.split('#')[1],
                  id: qrcodeClaim?.body?.credentials[0]?.id
              }
          ],
          url: qrcodeClaim?.body?.url
      }
      };

      res.status(200).json({qrcode: claimRequest});
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
};



const onchainqr = async (req: NextApiRequest, res: NextApiResponse) => {
  const { claimId, to } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

    if (!claimId || !to) {
      throw new Error('No result claim ID provided');
      const errorResponse = {
        statusCode: 500,
        message: 'No result claim ID provided' || 'An error occurred',
        success: false,
      };
      res.status(500).json(errorResponse);
    }

    try {
      const idid = process.env.API_ISSUER_DID;
      const qrcodeClaim = await getClaimIdQrCode(idid, claimId)
      //qrcodeClaim?.body?.credentials[0]?.description = `${qrcodeClaim?.body?.credentials[0]?.description}`.split('#')[1]

      // Add request claim proof
      const claimRequest = {
        id: claimId,
        thid: claimId,
        typ: "application/iden3comm-plain-json",
        type: "https://iden3-communication.io/credentials/1.0/offer",
        from: idid,
        to: to,
        body: {
          reason: "survey participation",
          transaction_data: {
            contract_address: "0x59E4D1B1Fbb4438fa50cf3CfaC57a12cf5b12E7b",
            method_id: "b68967e2",
            chain_id: 80001,
            network: "polygon-mumbai"
          },
          credentials: [
              {
                  description: `${qrcodeClaim?.body?.credentials[0]?.description}`.split('#')[1],
                  id: qrcodeClaim?.body?.credentials[0]?.id
              }
          ],
          url: qrcodeClaim?.body?.url
      }
      };

      res.status(200).json({qrcode: claimRequest});
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
};


const signin = (req: NextApiRequest, res: NextApiResponse) => {  
  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Authentication',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  /*const proofRequest = {
      id: 1,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'KYCAgeCredential',
        context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
        credentialSubject: {
          birthday: {
            $lt: 20000101,
          },
        },
    },
    };*/
  //const scope = request.body.scope ?? [];
  //request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  //console.log('requestMap == ', requestMap)
  //console.log('request ==>', request)
  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

const status = async (req: NextApiRequest, res: NextApiResponse) => {
  
  const sessionId = req.query.sessionId;
  const authResponse = responseMap.get(`${sessionId}`);

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    res.status(204).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
    return
  }

  if (!authResponse) {
    res.status(400).end('no authorization response yet')
    return
  }

  try {
    // Get session ID from request
    //console.log('requestMap == ', requestMap)
    //console.log('responseMap == ', responseMap)
    //console.log('authResponse ==>', authResponse)

    return res.status(200).json(authResponse);
  
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }

}

const callback = async (req: NextApiRequest, res: NextApiResponse) => {

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Readable = require('stream').Readable
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getRawBody = require('raw-body')

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    res.status(204).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
  // Get session ID from request
  const sessionId = req.query.sessionId;

  //console.log('REQ BODY ===> ', req.body)
  //parse body
  const nbody = Object.keys(req.body)
  // convert to stream
  const s = new Readable()
  s.push(nbody[0]);    // the string you want
  s.push(null);
  // get JWZ token params from the post request
  const raw = await getRawBody(s);
  const tokenStr = raw.toString().trim();

  const ethURL = 'https://rpc-mumbai.maticvigil.com/v1/0b42a50a9a403a1f3ceefa8fec6ae43fb3e381ca';
  const contractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = `${APP_DIR}/lib/keys`;

  const ethStateResolver = new resolver.EthStateResolver(
      ethURL,
      contractAddress,
    );

  const resolvers = {
      ['polygon:mumbai']: ethStateResolver,
  };

  //console.log("ethStateResolver: ",ethStateResolver);

  // fetch authRequest from sessionID
  const authRequest = requestMap.get(`${sessionId}`);

  console.log("authRequest: ",authRequest);

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  //const sLoader = loaders.UniversalSchemaLoader('ipfs.io');
  const schemaLoader = loaders.getDocumentLoader({
    ipfsNodeURL: 'https://ipfs.io'
  });
  
  //console.log("verificationKeyloader: ",verificationKeyloader);

  // EXECUTE VERIFICATION
  let authResponse: any;

  /*const verifier = new auth.Verifier(
    verificationKeyloader,
    sLoader,
    resolvers,
  );*/

  const verifier = await auth.Verifier.newVerifier(
    verificationKeyloader,
    resolvers,
    {
      documentLoader: schemaLoader,
    }
  );

  console.log("verifier: ",verifier);

  try {
    const opts: any = {
        AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
    };
    
    console.log("authResponse: ", tokenStr, req.body, authRequest, opts);

    if (tokenStr !== '0') {
      authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
      //console.log("authResponse: ", authResponse);

      if (authResponse) {
      responseMap.set(`${sessionId}`, { authResponse: authResponse, id: authResponse.from, jwz: tokenStr, proofs: [] });
      //console.log("authResponse: ", authResponse, tokenStr);
      // Store auth response in map associated with session ID
      }
      // support the browser data wallet
    } else {
      authResponse = await verifier.fullVerify(req.body, authRequest, opts);
      console.log("authResponse: ", authResponse);

      if (authResponse) {
      responseMap.set(`${sessionId}`, { authResponse: authResponse, id: authResponse.from, jwz: req.body, proofs: [] });
      //console.log("authResponse: ", authResponse, tokenStr);
      // Store auth response in map associated with session ID
      }
    }

  } catch (error) {
    console.log(error);
  }

  console.log("User with ID: " + authResponse.from + " Succesfully authenticated")
  res.status(200).json({ statusCode: 200, message: "user with ID: " + authResponse.from + " Succesfully authenticated"});

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};


const challengestatus = async (req: NextApiRequest, res: NextApiResponse) => {
  
  const challengeId = req.query.challengeId;
  const authResponse = challengeMap.get(`${challengeId}`);

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    res.status(204).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
    return
  }

  if (!authResponse) {
    res.status(400).end('no authorization response yet')
    return
  }

  try {
    // Get session ID from request
    //console.log('requestMap == ', requestMap)
    //console.log('responseMap == ', responseMap)
    //console.log('authResponse ==>', authResponse)

    return res.status(200).json(authResponse);
  
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }

}

const challenge = async (req: NextApiRequest, res: NextApiResponse) => {

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Readable = require('stream').Readable
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getRawBody = require('raw-body')

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    res.status(204).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
  // Get session ID from request
  const challengeId = req.query.challengeId;

  //parse body
  const nbody = Object.keys(req.body)
  // convert to stream
  const s = new Readable()
  s.push(nbody[0]);    // the string you want
  s.push(null);
  // get JWZ token params from the post request
  const raw = await getRawBody(s);
  const tokenStr = raw.toString().trim();

  const ethURL = 'https://rpc-mumbai.maticvigil.com/v1/0b42a50a9a403a1f3ceefa8fec6ae43fb3e381ca';
  const contractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = `${APP_DIR}/lib/keys`;

  const ethStateResolver = new resolver.EthStateResolver(
      ethURL,
      contractAddress,
    );

  const resolvers = {
      ['polygon:mumbai']: ethStateResolver,
  };

  console.log("ethStateResolver: ",ethStateResolver);

  // fetch authRequest from sessionID
  const authRequest = requestMap.get(`${sessionId}`);

  console.log("authRequest: ",authRequest);

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  //const sLoader = loaders.UniversalSchemaLoader('ipfs.io');
  const schemaLoader = loaders.getDocumentLoader({
    ipfsNodeURL: 'https://ipfs.io'
  });
  
  //console.log("verificationKeyloader: ",verificationKeyloader);

  // EXECUTE VERIFICATION
  let authResponse: any;

  const verifier = await auth.Verifier.newVerifier(
    verificationKeyloader,
    resolvers,
    {
      documentLoader: schemaLoader,
    }
  );

  console.log("verifier: ",verifier);

  try {
    const opts: any = {
        AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
    };        
    authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);

    challengeMap.set(`${challengeId}`, { authResponse: authResponse, id: authResponse.from, jwz: tokenStr, proofs: [] });
    //console.log("authResponse: ", authResponse, tokenStr);
    // Store auth response in map associated with session ID

  } catch (error) {
    console.log(error);
  }

  console.log("User with ID: " + authResponse.from + " Succesfully authenticated")
    res.status(200).json({ statusCode: 200, message: "user with ID: " + authResponse.from + " Succesfully authenticated"});

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

const ageproof = (req: NextApiRequest, res: NextApiResponse) => {  
  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  console.log('URI ===>', uri)
  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Proof of age',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  const proofRequest = {
      id: 1,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'KYCAgeCredential',
        context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
        credentialSubject: {
          birthday: {
            $lt: 20000101,
          },
        },
    },
    };
  
    const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  //console.log('requestMap == ', requestMap)
  //console.log('request ==>', request)
  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

const countryproof = (req: NextApiRequest, res: NextApiResponse) => {  
  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Proof of Country of Residence',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  const proofRequest = {
      id: 2,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'KYCCountryOfResidenceCredential',
        context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
        credentialSubject: {
          countryCode: {
            $in: [
              55,
              1
            ]
          }
        },
    },
    };
  
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  //console.log('requestMap == ', requestMap)
  //console.log('request ==>', request)
  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};


const proofofwork = (req: NextApiRequest, res: NextApiResponse) => {
  const { profileId, surveyId, resultsId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!surveyId || !profileId || !resultsId) {
    throw new Error('No results provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No results provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Proof of work claim',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  const proofRequest = {
      id: 3,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'ProofOfWorkClaim',
        context: 'https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-work/json-ld/proof-of-work.json-ld',
        credentialSubject: {
          resultsId: {
            $in: [resultsId]
          }
        },
    },
    };
  
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};


const proofofsurvey = (req: NextApiRequest, res: NextApiResponse) => {
  const { profileId, surveyId } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!surveyId || !profileId) {
    throw new Error('No results provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No results provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Proof of work claim',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  const proofRequest = {
      id: 4,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'ProofOfWorkClaim',
        context: 'https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-work/json-ld/proof-of-work.json-ld',
        credentialSubject: {
          surveyId: {
            $in: [surveyId]
          }
        },
    },
    };
  
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};


const proofofboost = (req: NextApiRequest, res: NextApiResponse) => {
  const { profileId, orderId, typeBoost } = req.body;

  if (req.method === 'OPTIONS' && process.env.NODE_ENV === 'development')
    return res.status(204).end();

  if (!orderId || !profileId || !typeBoost) {
    throw new Error('No boost info provided');
    const errorResponse = {
      statusCode: 500,
      message: 'No boost info provided' || 'An error occurred',
      success: false,
    };
    res.status(500).json(errorResponse);
  }

  try {
  // Audience is verifier id
  const hostUrl = API_SERVER_URL;
  sessionId++;
  const callbackURL = "/did/callback"
  const audience = process.env.API_ISSUER_DID

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
      'QSTN Proof of boost claim',
      audience,
      uri,
  );

  const thid_id = uuid();
  request.id = thid_id;
  request.thid = thid_id;

  // Add request for a specific proof
  const proofRequest = {
      id: 5,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'ProofOfBoostClaim',
        context: 'https://raw.githubusercontent.com/sekmet/0xPolygonID-tutorial-examples/main/credential-schema/proof-of-boost/json-ld/proof-of-boost.json-ld',
        credentialSubject: {
          orderId: {
            $in: [orderId]
          }
        },
    },
  };
  
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID
  requestMap.set(`${sessionId}`, request);

  return res.status(200).json(request);

  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { did } = req.query;

  if (did === 'qrcode') {
    try {
      return qrcode(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'sign-in') {
    try {
      return signin(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'status') {
    try {
      return status(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'proof') {
    try {
      return challengestatus(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'challenge') {
    try {
      return challenge(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'issueclaim') {
    try {
      return issueclaim(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'issuecountryclaim') {
    try {
      return issuecountryclaim(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'issueageclaim') {
    try {
      return issueageclaim(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'issueboostclaim') {
    try {
      return issueboostclaim(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'issuepurchaseclaim') {
    try {
      return issuepurchaseclaim(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'callback') {
    try {
      return callback(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'proof-of-work') {
    try {
      return proofofwork(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'proof-of-survey') {
    try {
      return proofofsurvey(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'proof-of-boost') {
    try {
      return proofofboost(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  if (did === 'proof-of-country-of-residence') {
    try {
      return countryproof(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  if (did === 'proof-of-age') {
    try {
      return ageproof(req,res);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

}

export default handler;

