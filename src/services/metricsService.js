import { db } from '../lib/firebase';
import { ref, get, query, orderByChild } from 'firebase/database';

export const MetricsService = {
    /**
     * Calculates aggregated metrics for the Admin Dashboard
     * derived from the 'barbershops' collection.
     */
    getAdminMetrics: async () => {
        try {
            const dbRef = ref(db, 'barbershops');
            const snapshot = await get(dbRef);

            if (!snapshot.exists()) {
                return MetricsService.getEmptyAdminMetrics();
            }

            const users = [];
            snapshot.forEach(child => {
                users.push({ id: child.key, ...child.val() });
            });

            // 1. Calculate User Counts
            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.status === 'active').length;

            // 2. Subscription Distribution
            const basicCount = users.filter(u => u.subscriptionPlan === 'basic').length;
            const premiumCount = users.filter(u => u.subscriptionPlan === 'premium').length;
            const trialCount = users.filter(u => !u.subscriptionPlan || u.subscriptionPlan === 'trial').length;

            // 3. Estimated Revenue (Mock based on plan)
            // Basic = 29, Premium = 59
            const currentMonthlyRevenue = (basicCount * 29) + (premiumCount * 59);

            // Return formatted data matches AdminPanel expectation
            return {
                totalUsers,
                activeUsers,
                subscriptionDistribution: [
                    { name: 'Básico', value: basicCount },
                    { name: 'Premium', value: premiumCount },
                    { name: 'Prueba', value: trialCount }
                ],
                revenueData: {
                    monthly: currentMonthlyRevenue,
                    // Mock breakdown for charts (since we don't have historical data stored yet)
                    monthly_breakdown: [
                        { month: 'Abr', revenue: currentMonthlyRevenue * 0.8 },
                        { month: 'May', revenue: currentMonthlyRevenue * 0.9 },
                        { month: 'Jun', revenue: currentMonthlyRevenue }
                    ]
                },
                userGrowthData: [
                    // Mock growth
                    { month: 'Abr', users: Math.floor(totalUsers * 0.8) },
                    { month: 'May', users: Math.floor(totalUsers * 0.9) },
                    { month: 'Jun', users: totalUsers }
                ],
                platformUsage: {
                    // Placeholder values until we have an Appointments collection
                    appointmentsToday: users.length * 12,
                    appointmentsWeek: users.length * 80,
                    appointmentsMonth: users.length * 320,
                    activeSessions: Math.floor(users.length * 0.2), // 20% users online
                    avgSessionTime: 15,
                    pageViews: users.length * 150,
                    openTickets: 5,
                    resolvedToday: 2,
                    avgResponseTime: 1.5
                }
            };
        } catch (error) {
            console.error("Error calculating admin metrics:", error);
            return MetricsService.getEmptyAdminMetrics();
        }
    },

    getEmptyAdminMetrics: () => ({
        totalUsers: 0,
        activeUsers: 0,
        subscriptionDistribution: [],
        revenueData: { monthly: 0, monthly_breakdown: [] },
        userGrowthData: [],
        platformUsage: {}
    }),

    /**
     * Fetches metrics for a specific Business Dashboard.
     * Looks for 'stats' node or calculates from sub-collections.
     */
    getBusinessMetrics: async (uid) => {
        try {
            const userRef = ref(db, `barbershops/${uid}`);
            const snapshot = await get(userRef);

            if (!snapshot.exists()) return null;

            const data = snapshot.val();

            // If we had an 'appointments' collection, we would query it here.
            // For now, we simulate based on available data or use stored stats.

            const storedStats = data.stats || {};

            // Simulate Chart Data (Revenue History)
            const currentRev = storedStats.revenueMonth || 0;
            const currentAppts = storedStats.appointmentsMonth || 0;

            const chartData = [
                { name: 'Ene', ingresos: Math.floor(currentRev * 0.7), citas: Math.floor(currentAppts * 0.6) },
                { name: 'Feb', ingresos: Math.floor(currentRev * 0.8), citas: Math.floor(currentAppts * 0.7) },
                { name: 'Mar', ingresos: Math.floor(currentRev * 0.9), citas: Math.floor(currentAppts * 0.85) },
                { name: 'Abr', ingresos: Math.floor(currentRev * 0.85), citas: Math.floor(currentAppts * 0.8) },
                { name: 'May', ingresos: Math.floor(currentRev * 0.95), citas: Math.floor(currentAppts * 0.9) },
                { name: 'Jun', ingresos: currentRev, citas: currentAppts } // Current month
            ];

            return {
                cards: [
                    {
                        id: 'revenue',
                        title: 'Ingresos del Mes',
                        value: `$${currentRev}`,
                        change: '+0%', // Dynamic change calc requires history
                        changeType: 'neutral',
                        icon: 'DollarSign',
                        subtitle: 'Actual'
                    },
                    {
                        id: 'appointments',
                        title: 'Citas Totales',
                        value: currentAppts,
                        change: '+0%',
                        changeType: 'neutral',
                        icon: 'Calendar',
                        subtitle: 'Este mes'
                    },
                    {
                        id: 'customers',
                        title: 'Clientes Activos',
                        value: storedStats.activeCustomers || 0,
                        change: '+0%',
                        changeType: 'neutral',
                        icon: 'Users',
                        subtitle: 'Últimos 30 días'
                    },
                    {
                        id: 'satisfaction',
                        title: 'Satisfacción',
                        value: '5.0/5',
                        change: '+0.0',
                        changeType: 'neutral',
                        icon: 'Star',
                        subtitle: 'Puntuación promedio'
                    }
                ],
                chartData
            };

        } catch (error) {
            console.error("Error fetching business metrics:", error);
            return { cards: [], chartData: [] };
        }
    }
};
