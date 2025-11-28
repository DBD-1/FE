import React from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ClientRanking } from "@/api/api";
import { getClientRankings } from "@/api/api";

const ClientRankingPage = () => {
  // useQuery가 실제 API를 호출하도록 수정
  const { data: clientRankings = [], isLoading, error } = useQuery<ClientRanking[], Error>({
    // 전체 고객사 랭킹을 조회하므로, 쿼리 키를 'clientRankings'로 단순화
    queryKey: ['clientRankings'],
    queryFn: getClientRankings, // employeeId 없이 호출
  });

  return (
    <DashboardLayout>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>고객 신용 평가 랭킹</CardTitle>
          <CardDescription>고객 신용 평가 점수를 기준으로 산정된 고객사 순위입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">순위</TableHead>
                <TableHead>고객사명</TableHead>
                <TableHead className="text-right">평균 점수</TableHead>
                <TableHead className="text-center">등급</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">랭킹을 불러오는 중입니다...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">오류: {error.message}</TableCell>
                </TableRow>
              ) : clientRankings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">표시할 랭킹 정보가 없습니다.</TableCell>
                </TableRow>
              ) : (
                clientRankings.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell className="font-medium text-center">{client.rank ?? 'N/A'}</TableCell>
                    <TableCell>{client.client_name}</TableCell>
                    <TableCell className="text-right">{client.average_score.toFixed(2)}점</TableCell>
                    <TableCell className="text-center">{client.grade}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ClientRankingPage;