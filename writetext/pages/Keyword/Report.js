import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Body from "../../components/Body";
import Content from "../../components/Content";
import CannibalizationReport from "../../components/Keyword/CannibalizationReport";
import styles from "../../styles/styling/Keyword.module.css";
import apiService from "../../services/ApiService";

import { isValidUrl, addHttps } from '../../utils/helper';

export default function Report({userData}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState([]);
    const [generatingCsv, setGeneratingCsv] = useState(false);
    const exportCsv = async () => {
        setGeneratingCsv(true);

        setTimeout(() => {
            //export the sampleData to a csv file. header is keyword, search volume, processed, url, position
            const headers = ['domain','date','keyword', 'search volume', 'processed', 'url', 'position'];
            const csvData = [
                headers.join(','), // Add headers as first row
                ...report.flatMap(item => 
                    item.keywords.flatMap(keyword => 
                        keyword.urlGroups.flatMap(group => 
                            group.urls.map(url => [
                                `"${addHttps(item.domain)}"`,
                                `"${item.date}"`,
                                `"${keyword.keyword}"`,
                                keyword.searchVolume,
                                keyword.processed,
                                `"${url.url}"`,
                                url.position
                            ].join(','))
                        )
                    )
                )
            ].join('\n');
            
            setGeneratingCsv(false);

            const today = new Date().getTime()
            const fileName = `keyword_cannibalization_report_${today}.csv`;
            const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
            const link = document.createElement("a");
            link.href = csvContent;
            link.download = fileName;
            link.click();
        }, 2000);
    }

    useEffect(() => {
        if (router.isReady) {
            apiService.get("KeywordCannibalizationReport").then((response) => {
                setReport(response.data);
                setLoading(false);
            });
        }
    }, [router.isReady]);

    if (userData)
    return (
        <Body>
          <Content>
              <div className='header d-flex '>
                <div>
                    <p className={`d-flex mb-15`}><p className={`back-btn ${styles.keywordBackBtn}`} onClick={() => router.push('/keyword')}></p>Keyword cannibalization report</p>
                </div>
                <div className="right ms-auto">
                    {report.length > 0 && <button id='exportCsv' type="button" className={`btn btn-primary submit-button ${generatingCsv ? 'disabled' : ''}`} onClick={exportCsv} disabled={generatingCsv} >
                    {generatingCsv ? (
                        <>
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                        </>
                    ) : (
                        "Export as CSV"
                    )}
                    </button>}
                </div>
              </div> 
              <CannibalizationReport userData={userData} report={report} loading={loading} />
          </Content>
        </Body>
    )
}
