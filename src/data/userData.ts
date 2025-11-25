export interface User {
  id: number
  name: string
  email: string
  phone?: string
  profileImage?: string
}

export const mockUser: User = {
  id: 1,
  name: '홍길동',
  email: 'user@example.com',
  phone: '010-1234-5678',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
}

export const mockUsers: User[] = [
  mockUser,
  {
    id: 2,
    name: '김철수',
    email: 'test@example.com',
    phone: '010-9876-5432'
  }
]
