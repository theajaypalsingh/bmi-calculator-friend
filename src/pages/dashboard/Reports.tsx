
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { format } from "date-fns";

const ReportsPage = () => {
  const { records, loading } = useHealthRecords();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">My Reports</h1>
        <p className="text-gray-500">You haven't calculated any health metrics yet.</p>
        <p className="text-gray-500">Use our calculators to track your health progress!</p>
      </div>
    );
  }

  const getCalculatorName = (type: string) => {
    switch (type) {
      case "bmi":
        return "BMI Calculator";
      case "bmr":
        return "BMR Calculator";
      case "bodyfat":
        return "Body Fat Calculator";
      case "healthscore":
        return "Health Score";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const renderResultDetails = (record: any) => {
    const { calculator_type, result } = record;

    switch (calculator_type) {
      case "bmi":
        return (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Height: {result.height} {result.heightUnit}</div>
              <div>Weight: {result.weight} {result.weightUnit}</div>
              <div>BMI: {result.bmi.toFixed(1)}</div>
              <div>Category: {result.category}</div>
            </div>
          </>
        );
      case "bmr":
        return (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Age: {result.age} years</div>
              <div>Gender: {result.gender}</div>
              <div>Height: {result.height} {result.heightUnit}</div>
              <div>Weight: {result.weight} {result.weightUnit}</div>
              <div>BMR: {result.bmr.toFixed(0)} calories/day</div>
              <div>Activity Level: {result.activityLevel}</div>
            </div>
          </>
        );
      case "bodyfat":
        return (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Gender: {result.gender}</div>
              <div>Body Fat: {result.bodyFatPercentage.toFixed(1)}%</div>
              <div>Category: {result.category}</div>
            </div>
          </>
        );
      case "healthscore":
        return (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Health Score: {result.score}/100</div>
              <div>Category: {result.category}</div>
            </div>
          </>
        );
      default:
        return <pre className="text-xs overflow-hidden">{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Reports</h1>
      
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{getCalculatorName(record.calculator_type)}</h3>
              <span className="text-xs text-gray-500">
                {format(new Date(record.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              {renderResultDetails(record)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
