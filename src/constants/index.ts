export const PrismaClientErrorCode = {
  BAD_REQUEST: 'P2000',
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};

export const Messages = {
  ACCESS_DENIED: 'Access Denied',
  NOT_ALLOWED: 'You are not allowed to perform this action',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  ACCEPTED_ANSWER_EXIST:
    'There is already an accepted answer for this question',
  ANSWER_NOT_BELONGED: 'This answer does not belong in the question',
};

export const DynamicMessage = {
  CRUD: {
    createSuccess: (field: string) => `Create ${field} successfully`,
    getSuccess: (field: string) => `Get ${field} successfully`,
    updateSuccess: (field: string) => `Update ${field} successfully`,
    deleteSuccess: (field: string) => `Delete ${field} successfully`,
  },
  actionSuccess: (field: string) => `${field} successful`,
  duplicate: (field: string) => `${field} already exists`,
  invalid: (field: string) => `Invalid ${field}`,
  notFound: (field: string) => `${field} not found`,
};

// Temp Vietnamese
export const tagsSeedData = [
  { name: 'Giải tích 1', description: 'Giải tích 1 là ...' },
  { name: 'Giải tích 2', description: 'Giải tích 2 là ...' },
  { name: 'Giải tích 3', description: 'Giải tích 3 là ...' },
  {
    name: 'Xác suất thống kê',
    description: 'Xác suất thống kê là ...',
  },
  {
    name: 'Đại số tuyến tính',
    description: 'Đại số tuyến tính là ...',
  },
  {
    name: 'Công thức Bernoulli',
    description: 'Công thức Bernoulli là ...',
  },
  { name: 'Tập hợp', description: 'Tập hợp là ...' },
  { name: 'Logic', description: 'Logic là ...' },
  { name: 'Ánh xạ', description: 'Ánh xạ là ...' },
  { name: 'Số phức', description: 'Số phức là ...' },
  { name: 'Ma trận', description: 'Ma trận là ...' },
  { name: 'Định thức', description: 'Định thức là ...' },
  { name: 'Hệ phương trình', description: 'Hệ phương trình là ...' },
  { name: 'Không gian Vector', description: 'Không gian Vector là ...' },
  { name: 'Ánh xạ tuyến tính', description: 'Ánh xạ tuyến tính là ...' },
  { name: 'Dạng toàn phương', description: 'Dạng toàn phương là ...' },
  { name: 'Không gian Euclide', description: 'Không gian Euclide là ...' },
  { name: 'Hàm số một biến số', description: 'Hàm số một biến số là ...' },
  { name: 'Hàm số', description: 'Hàm số là ...' },
  { name: 'Dãy số', description: 'Dãy số là ...' },
  { name: 'Giới hạn hàm số', description: 'Giới hạn hàm số là ...' },
  { name: 'Vô cùng lớn', description: 'Vô cùng lớn là ...' },
  { name: 'Vô cùng bé', description: 'Vô cùng bé là ...' },
  { name: 'Hàm số liên tục', description: 'Hàm số liên tục là ...' },
  { name: 'Đạo hàm', description: 'Đạo hàm là ...' },
  { name: 'Vi phân', description: 'Vi phân là ...' },
  { name: 'Hàm khả vi', description: 'Hàm khả vi là ...' },
  {
    name: 'Phép tích phân một biến số',
    description: 'Phép tích phân một biến số là ...',
  },
  { name: 'Tích phân bất định', description: 'Tích phân bất định là ...' },
  { name: 'Tích phân xác định', description: 'Tích phân xác định là ...' },
  { name: 'Tích phân suy rộng', description: 'Tích phân suy rộng là ...' },
  { name: 'Chuỗi Fourier', description: 'Chuỗi Fourier là ...' },
  { name: 'Chuỗi hàm số', description: 'Chuỗi hàm số là ...' },
  { name: 'Chuỗi lũy thừa', description: 'Chuỗi lũy thừa là ...' },
  { name: 'Phương trình vi phân', description: 'Phương trình vi phân là ...' },
  {
    name: 'Phương trình vi phân cấp hai',
    description: 'Phương trình vi phân cấp hai là ...',
  },
  { name: 'Toán tử Laplace', description: 'Toán tử Laplace là ...' },
  { name: 'Sự kiện ngẫu nhiên', description: 'Sự kiện ngẫu nhiên là ...' },
  { name: 'Đối lập', description: 'Đối lập là ...' },
  { name: 'Xung khắc', description: 'Xung khắc là ...' },
  { name: 'Kéo theo', description: 'Kéo theo là ...' },
  { name: 'Tương đương', description: 'Tương đương là ...' },
  { name: 'Chỉnh hợp', description: 'Chỉnh hợp là ...' },
  { name: 'Chỉnh hợp lặp', description: 'Chỉnh hợp lặp là ...' },
  { name: 'Hoán vị', description: 'Hoán vị là ...' },
  { name: 'Tổ hợp', description: 'Tổ hợp là ...' },
  { name: 'Định nghĩa cổ điển', description: 'Định nghĩa cổ điển là ...' },
  { name: 'Định nghĩa thống kê', description: 'Định nghĩa thống kê là ...' },
  { name: 'Định nghĩa tiên đề', description: 'Định nghĩa tiên đề là ...' },
  {
    name: 'Xác suất có điều kiện',
    description: 'Xác suất có điều kiện là ...',
  },
  {
    name: 'Công thức cộng xác suất',
    description: 'Công thức cộng xác suất là ...',
  },
  {
    name: 'Công thức nhân xác suất',
    description: 'Công thức nhân xác suất là ...',
  },
  { name: 'Công thức Bayes', description: 'Công thức Bayes là ...' },
  { name: 'Nhóm đầy đủ', description: 'Nhóm đầy đủ là ...' },
  {
    name: 'Công thức xác suất đầy đủ',
    description: 'Công thức xác suất đầy đủ là ...',
  },
  { name: 'Biến ngẫu nhiên', description: 'Biến ngẫu nhiên là ...' },
  {
    name: 'Luật phân phối xác suất',
    description: 'Luật phân phối xác suất là ...',
  },
  {
    name: 'Biến ngẫu nhiên rời rạc',
    description: 'Biến ngẫu nhiên rời rạc là ...',
  },
  {
    name: 'Biến ngẫu nhiên liên tục',
    description: 'Biến ngẫu nhiên liên tục là ...',
  },
  {
    name: 'Bảng phân phối xác suất',
    description: 'Bảng phân phối xác suất là ...',
  },
  { name: 'Hàm xác suất', description: 'Hàm xác suất là ...' },
  {
    name: 'Số đặc trưng của biến ngẫu nhiên',
    description: 'Số đặc trưng của biến ngẫu nhiên là ...',
  },
  { name: 'Kỳ vọng', description: 'Kỳ vọng là ...' },
  { name: 'Phương sai', description: 'Phương sai là ...' },
  { name: 'Mốt', description: 'Mốt là ...' },
  { name: 'Trung vị', description: 'Trung vị là ...' },
  { name: 'Momen', description: 'Momen là ...' },
  { name: 'Phân phối đều', description: 'Phân phối đều là ...' },
  {
    name: 'Phân phối đều rời rạc',
    description: 'Phân phối đều rời rạc là ...',
  },
  {
    name: 'Phân phối đều liên tục',
    description: 'Phân phối đều liên tục là ...',
  },
  { name: 'Phân phối nhị thức', description: 'Phân phối nhị thức là ...' },
  { name: 'Phân phối Bernoulli', description: 'Phân phối Bernoulli là ...' },
  { name: 'Phân phối Poisson', description: 'Phân phối Poisson là ...' },
  { name: 'Phân phối hình học', description: 'Phân phối hình học là ...' },
  { name: 'Phân phối chuẩn', description: 'Phân phối chuẩn là ...' },
  { name: 'Phân phối gamma', description: 'Phân phối gamma là ...' },
];

export const SearchFormat = {
  TAG: '[tag]',
  USER: '[user]',
  SCORE: '[score]',
  IS_ACCEPTED: '[isaccepted]',
};

export const ReputationPoints = {
  USER_CREATED_ANSWER: 15,
  USER_ACCEPTED_ANSWER: 2,
  QUES_ANS_UPVOTE: 10,
  QUES_ANS_DOWNVOTE: 2,
  QUES_ANS_UPDATED: 12,
};
