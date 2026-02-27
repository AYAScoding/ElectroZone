"use client"

interface Activity {
  id: number
  action: string
  description: string
  time: string
}

interface RecentActivityProps {
  activities?: Activity[]
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{activity.action}</p>
                <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                <p className="text-muted-foreground/60 text-xs mt-2">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
