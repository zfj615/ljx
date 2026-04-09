import React, { useEffect, useState, useCallback } from 'react';
import * as Types from '../types';
import { supabase } from '../supabase';
import { useAuth } from '../useAuth';

const AchievementPage: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Types.Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Types.UserBadge[]>([]);
  const [achievements, setAchievements] = useState<Types.Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Types.UserAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<Types.UserPoints[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    // 加载所有徽章
    const { data: badgesData } = await supabase
      .from('badges')
      .select('*');
    setBadges(badgesData || []);

    // 加载用户徽章
    const { data: userBadgesData } = await supabase
      .from('user_badges')
      .select('*, badge(*)')
      .eq('user_id', user.id);
    setUserBadges(userBadgesData || []);

    // 加载所有成就
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*');
    setAchievements(achievementsData || []);

    // 加载用户成就
    const { data: userAchievementsData } = await supabase
      .from('user_achievements')
      .select('*, achievement(*)')
      .eq('user_id', user.id);
    setUserAchievements(userAchievementsData || []);

    // 加载排行榜
    const { data: leaderboardData } = await supabase
      .from('user_points')
      .select('*, user:auth.users(email)')
      .order('points', { ascending: false })
      .limit(10);
    // 类型安全处理
    setLeaderboard(Array.isArray(leaderboardData) ? (leaderboardData as any as Types.UserPoints[]) : []);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await loadData();
      } else {
        // 当用户为null时，重置所有状态
        setBadges([]);
        setUserBadges([]);
        setAchievements([]);
        setUserAchievements([]);
        setLeaderboard([]);
        setLoading(false);
      }
    };

    initializeData();
  }, [user, loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-600">请先登录</div>
      </div>
    );
  }

  // 计算用户已获得的徽章和成就
  const earnedBadges = userBadges.length;
  const totalBadges = badges.length;
  const unlockedAchievements = userAchievements.length;
  const totalAchievements = achievements.length;

  // 计算用户总积分
  const userPoints = userAchievements.reduce((total, ua) => {
    return total + (ua.achievement?.points || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">成就与徽章</h1>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-blue-600">{earnedBadges}/{totalBadges}</div>
            <div className="text-gray-600 text-xs sm:text-sm">已获得徽章</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-green-600">{unlockedAchievements}/{totalAchievements}</div>
            <div className="text-gray-600 text-xs sm:text-sm">已解锁成就</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-purple-600">{userPoints}</div>
            <div className="text-gray-600 text-xs sm:text-sm">总积分</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-yellow-600">
              {leaderboard.findIndex(lb => lb.user_id === user.id) + 1 || 'N/A'}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">排行榜排名</div>
          </div>
        </div>

        {/* 徽章部分 */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">我的徽章</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map(badge => {
              const isEarned = userBadges.some(ub => ub.badge_id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-lg p-3 sm:p-4 text-center transition-all duration-300 ${isEarned ? 'bg-white shadow' : 'bg-gray-100 opacity-60'}`}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-bold mb-1 text-sm sm:text-base">{badge.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{badge.description}</p>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${badge.level === 'bronze' ? 'bg-amber-100 text-amber-800' : badge.level === 'silver' ? 'bg-gray-200 text-gray-800' : badge.level === 'gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                    {badge.level === 'bronze' ? '青铜' : badge.level === 'silver' ? '白银' : badge.level === 'gold' ? '黄金' : '铂金'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 成就部分 */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">我的成就</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map(achievement => {
              const isUnlocked = userAchievements.some(ua => ua.achievement_id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-4 transition-all duration-300 ${isUnlocked ? 'bg-white shadow' : 'bg-gray-100 opacity-60'}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h3 className="font-bold">{achievement.name}</h3>
                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {achievement.points} 积分
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                  {isUnlocked && (
                    <div className="mt-2 text-xs text-gray-500">
                      解锁于: {new Date(userAchievements.find(ua => ua.achievement_id === achievement.id)?.unlocked_at || '').toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 排行榜部分 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">排行榜</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">积分</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className={entry.user_id === user.id ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.user?.email || '未知用户'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;