import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "../../styles/styling/Keyword.module.css";
import KeywordSettings from '../../components/Keyword/Settings';
import Body from '../../components/Body';
import Content from '../../components/Content';
import { MemberTypeEnum } from '../../enum/MemberType';


export default function Settings({userData, reloadAccount}) {
    const router = useRouter();
  

    if (userData) 
  return (
    <Body>
      <Content>
          <div className='header'>
            <p className={`d-flex mb-15`}><p className={`back-btn ${styles.keywordBackBtn}`} onClick={() => router.push('/keyword')}></p>Keyword cannibalization monitoring settings {userData.credit.membershipType == MemberTypeEnum.FREE && <Image src="/images/ic_premium_with_text.svg" alt="Processed" width={79} height={19} style={{marginLeft: '14px', marginTop: '10px'}} />}</p>           
          </div> 
          <KeywordSettings userData={userData} reloadAccount={reloadAccount} />
      </Content>
    </Body>
  );
}

