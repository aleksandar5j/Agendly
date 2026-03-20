import axios from './config'

export default {
  userLogin: ({ username, password }) => axios.post('auth/login', { username, password }),
  userRegister: ({ fullname, username, password, email }) =>
    axios.post('auth/register', { fullname, username, password, email }),

  userTasks: (sid) => axios.get('dashboard/tasks', { params: { sid } }),

  userAllTasks: (sid) => axios.get('tasks', { params: { sid } }),
  postTask: (data) => axios.post('tasks', data),
  deleteTask: (sid, tsk_id) => axios.delete('tasks', { params: { sid, tsk_id } }),
  editTask: (data) => axios.put('tasks', data),
  updateTaskStatus: (sid, tsk_id, sts_id) =>
    axios.put('dashboard/tasks/updateStatus', { sid, tsk_id, sts_id }),

  tasksLate: (sid) => axios.get('tasks/tasksLate', { params: { sid } }),

  getCategories: (data) => axios.get('categories', data),
  getStatuses: (data) => axios.get('statuses', data),

  getTaskStatusStats: (sid) => axios.get('taskStatistics/statusLength', { params: { sid } }),
  tasksDoneThisMonth: (sid) => axios.get('taskStatistics/taskStatus', { params: { sid } }),
  getMonthlyProgress: (sid) => axios.get('taskStatistics/monthlyProgress', { params: { sid } }),
  getFullYearProgress: (sid, month, year) =>
    axios.get('taskStatistics/fullYearProgress', {
      params: { sid, month, year },
    }),

  filterCategory: (cat_id) => axios.get('categories/filter', { params: { cat_id } }),
  filterStatus: (sts_id) => axios.get('statuses/filter', { params: { sts_id } }),
  filterTitle: (tsk_title) => axios.get('tasks/filterByTitle', { params: { tsk_title } }),

  getAllReminders: (sid) => axios.get('reminders', { params: { sid } }),
  addReminder: (tsk_id, rem_minutes_before) => axios.post('reminders', tsk_id, rem_minutes_before),
  editReminder: (data) => axios.put('reminders', data),
  deleteReminder: (rem_id) => axios.delete('reminders', { params: { rem_id } }),
  filterRemindersByTask: (tsk_id) => axios.get('reminders/filterByTask', { params: { tsk_id } }),

  autoDeleteReminders(sid) {
    return axios.post('reminders/autoDelete', { sid })
  },

  userUpdatePassword: (data) => axios.put('settings/updatePassword', data),
}
