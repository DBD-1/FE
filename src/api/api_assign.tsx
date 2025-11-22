// src/api/api_assign.tsx (개발자 투입 처리)

import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

export async function assignDeveloper(employeeId: number): Promise<any> {
  const url = `${API_BASE_URL}/developers/${employeeId}/assign`;

  try {
    const response = await axios.patch(url);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error(`[API Error] 개발자 투입 실패 (ID: ${employeeId})`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `개발자 투입 중 오류 발생 (상태: ${error.response?.status})`);
    }
    
    console.error(`[Unknown Error] 개발자 투입 처리 중 알 수 없는 오류 발생`, error);
    throw new Error('개발자 투입 처리 중 알 수 없는 오류가 발생했습니다.');
  }
}