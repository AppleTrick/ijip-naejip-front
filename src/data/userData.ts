import type { User } from '@/api/types'

export const mockUser: User = {
  id: '1',
  name: '홍길동',
  email: 'user@example.com',
  phone: '010-1234-5678',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  gender: 'male',
  ageGroup: '20s',
  job: 'student',
  maritalStatus: 'single',
  budget: { min: 0, max: 10 },
  interestAreas: ['investment'],
  commuteLocation: 'Seoul',
  notifications: {
    appPush: true,
    email: false,
    marketing: false
  }
}

export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    name: '김철수',
    email: 'test@example.com',
    phone: '010-9876-5432'
  }
]
