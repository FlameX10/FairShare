import { useState, useEffect } from "react";
import { getExpenses } from "../api/expenses";
import { generatePDF } from "../api/pdf";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const response = await generatePDF(expenses);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense-report.pdf");
      document.body.appendChild(link);
      link.click();
      setToast("PDF downloaded successfully!");
    } catch (error) {
      setToast("Error: " + (error.message || "Failed to generate PDF"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Generate a PDF report of all your expenses ({expenses.length} expenses)
            </p>
            <Button loading={loading} onClick={handleGeneratePDF}>
              📄 Generate PDF
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
