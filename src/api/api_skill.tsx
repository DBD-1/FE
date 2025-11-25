// src/hooks/api_skill.tsx (기술 목록 로드)

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

export interface Skill {
    skill_id: number;
    skill_name: string;
}

export function useFetchSkills() {
    const [skillList, setSkillList] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/skill`);
                
                if (Array.isArray(response.data)) {
                    setSkillList(response.data);
                }
            } catch (err) {
                console.error("기술 목록 로드 실패:", err);
                setError("기술 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return { skillList, loading, error };
}