using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Game.Api.Hubs
{
    public class GameHub : Hub
    {
        public async Task Ping(string from)
        {
            await Clients.All.SendAsync("pong", from);
        }
    }
}