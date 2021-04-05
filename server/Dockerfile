FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /source

COPY src/GameApi/*.csproj ./
RUN dotnet restore

COPY src/GameApi/. ./
RUN dotnet publish --configuration Release --output /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS final
WORKDIR /app
COPY --from=build /app ./

ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "GameApi.dll"]