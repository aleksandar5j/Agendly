import axios from './config'

export default {
  userLogin: ({ username, password }) => axios.post('auth/login', { username, password }),
  userRegister: ({ fullname, username, password, email }) =>
    axios.post('auth/register', { fullname, username, password, email }),

  userTasks: (sid) => axios.get('dashboard/tasks', { params: { sid } }),

  userAllTasks: (sid) => axios.get('tasks', { params: { sid } }),
  postTask: (data) => axios.post('tasks', data),
  deleteTask: (sid, tsk_id) => axios.delete('tasks', { params: { sid, tsk_id } }),
  updateTaskStatus: (sid, tsk_id, sts_id) =>
    axios.put('dashboard/tasks/updateStatus', { sid, tsk_id, sts_id }),

  getCategories: (data) => axios.get('categories', data),
  getStatuses: (data) => axios.get('statuses', data),

  getTaskStatusStats: (sid) => axios.get('taskStatistics/statusLength', { params: { sid } }),
  tasksDoneThisMonth: (sid) => axios.get('taskStatistics/taskStatus', { params: { sid } }),
  getMonthlyProgress: (sid) => axios.get('taskStatistics/monthlyProgress', { params: { sid } }),
  getFullYearProgress: (sid, month, year) =>
    axios.get('taskStatistics/fullYearProgress', {
      params: { sid, month, year },
    }),
}
