// src/api/api_employee.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';


const API_BASE_URL = "http://localhost:8000/api";

export interface Employee {
    employee_id: number;
    employee_name: string; 
    job_type: string;
    skill_level: string; 
    project_assignment_yn: number;
    skills: string[]; 
}

export function useFetchAllEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllEmployees = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/employees`);

            if (Array.isArray(response.data)) {
                setEmployees(response.data);
            } else {
                setEmployees([]);
                setError("API 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("전체 개발자 목록 로드 실패:", err);
            setError("전체 개발자 목록 로드 실패. 서버 상태를 확인하세요.");
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllEmployees();
    }, []); 

    return { employees, loading, error };
}