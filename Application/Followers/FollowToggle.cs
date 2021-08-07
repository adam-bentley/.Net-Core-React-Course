using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext dataContext;
            private readonly IUserAccessor userAcessor;

            public Handler(DataContext dataContext, IUserAccessor userAcessor)
            {
                this.dataContext = dataContext;
                this.userAcessor = userAcessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await dataContext.Users.FirstOrDefaultAsync(x => x.UserName == userAcessor.GetUsername());

                var target = await dataContext.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

                var following = await dataContext.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer, Target = target
                    };
                    dataContext.UserFollowings.Add(following);
                }
                else
                {
                    dataContext.UserFollowings.Remove(following);
                }

                var suceess = await dataContext.SaveChangesAsync() > 0;

                if (suceess) return Result<Unit>.Sucess(Unit.Value);

                return Result<Unit>.Failure("Failed to update");
            }
        }


    }
}
