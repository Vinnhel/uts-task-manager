import { FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 flex-1">
          {task.title}
        </h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onToggleStatus(task)}
            className={`p-2 rounded-lg transition ${
              task.status === 'Completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Toggle Status"
          >
            <FaCheck />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} Priority`}></span>
          <span className="text-xs text-gray-500">{task.priority}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <FaClock className="mr-1" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;