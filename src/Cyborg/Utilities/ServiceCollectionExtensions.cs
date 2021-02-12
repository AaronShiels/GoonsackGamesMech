using Microsoft.Extensions.DependencyInjection;

namespace Cyborg.Utilities
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSingleton<TService1, TService2, TImplementation>(this IServiceCollection services)
            where TService1 : class
            where TService2 : class
            where TImplementation : class, TService1, TService2
        {
            if (typeof(TService1) != typeof(TImplementation))
                services.AddSingleton<TService1>(svc => svc.GetRequiredService<TImplementation>());

            if (typeof(TService2) != typeof(TImplementation))
                services.AddSingleton<TService2>(svc => svc.GetRequiredService<TImplementation>());

            services.AddSingleton<TImplementation>();

            return services;
        }

        public static IServiceCollection AddScoped<TService1, TService2, TImplementation>(this IServiceCollection services)
            where TService1 : class
            where TService2 : class
            where TImplementation : class, TService1, TService2
        {
            if (typeof(TService1) != typeof(TImplementation))
                services.AddScoped<TService1>(svc => svc.GetRequiredService<TImplementation>());

            if (typeof(TService2) != typeof(TImplementation))
                services.AddScoped<TService2>(svc => svc.GetRequiredService<TImplementation>());

            services.AddScoped<TImplementation>();

            return services;
        }
    }
}