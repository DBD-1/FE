// src/hooks/api_developer.tsx (개발자 목록 로드)

import { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'query-string';

const API_BASE_URL = "http://localhost:8000/api";

export interface Developer {
    employee_id: number;
    name: string;
    skill_level: string;
    project_assignment_yn: number; 
    matched_skills: string[]; 
}

export function useFetchDevelopers(selectedSkills: string[]) {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDevelopers = async () => {
        if (selectedSkills.length === 0) {
            setDevelopers([]);
            setLoading(false);
            setError(null);
            return; 
        }
        setLoading(true);
        setError(null);

        try {
            const params = {
                skill_names: selectedSkills 
            };

            const response = await axios.get(`${API_BASE_URL}/developers/search`, {
                params: params,
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: 'none' }); 
                },
            });

            if (Array.isArray(response.data)) {
                setDevelopers(response.data);
            } else {
                setDevelopers([]);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
                 setDevelopers([]); 
                 console.log("검색 결과 없음 (404 처리)");
                 return;
            }
            setError("개발자 목록 로드 실패. API 경로를 확인하세요.");
            setDevelopers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevelopers();
    }, [selectedSkills.join(',')]); 

    return { developers, loading, error, fetchDevelopers };
}