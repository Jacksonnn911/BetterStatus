FROM golang:1.24-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /betterstatus-sync ./cmd/betterstatus-sync

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /betterstatus-sync /betterstatus-sync
ENTRYPOINT ["/betterstatus-sync"]
