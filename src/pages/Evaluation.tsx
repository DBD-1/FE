import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Evaluation = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    customerName: "",
    projectName: "",
    rating: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("평가가 성공적으로 등록되었습니다");
    setFormData({
      employeeName: "",
      customerName: "",
      projectName: "",
      rating: "",
      comment: "",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">고객 평가 등록</h2>
          <p className="text-muted-foreground mt-1">직원의 고객 평가를 입력하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>평가 정보</CardTitle>
            <CardDescription>직원에 대한 고객의 평가를 작성해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName">직원 이름</Label>
                <Input
                  id="employeeName"
                  placeholder="직원 이름을 입력하세요"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">고객사명</Label>
                <Input
                  id="customerName"
                  placeholder="고객사명을 입력하세요"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">프로젝트명</Label>
                <Input
                  id="projectName"
                  placeholder="프로젝트명을 입력하세요"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">평점</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="평점을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5점 - 매우 우수</SelectItem>
                    <SelectItem value="4">4점 - 우수</SelectItem>
                    <SelectItem value="3">3점 - 보통</SelectItem>
                    <SelectItem value="2">2점 - 미흡</SelectItem>
                    <SelectItem value="1">1점 - 매우 미흡</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">평가 내용</Label>
                <Textarea
                  id="comment"
                  placeholder="평가 내용을 상세히 작성하세요"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                평가 등록
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Evaluation;
