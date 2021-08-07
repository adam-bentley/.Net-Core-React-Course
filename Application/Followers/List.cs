using MediatR;
using System.Collections.Generic;
using Application.Profiles;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using AutoMapper;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Application.Interfaces;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await context.UserFollowings
                            .Where(x => x.Target.UserName == request.Username)
                            .Select(u => u.Observer)
                            .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                            .ToListAsync(cancellationToken: cancellationToken);
                        break;

                    case "following":
                        profiles = await context.UserFollowings
                            .Where(x => x.Observer.UserName == request.Username)
                            .Select(u => u.Target)
                            .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                            .ToListAsync(cancellationToken: cancellationToken);
                        break;
                }

                return Result<List<Profiles.Profile>>.Sucess(profiles);
            }
        }

    }
}
