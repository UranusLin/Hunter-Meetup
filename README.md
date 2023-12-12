# Hunter Meetup

## Introduction

Hunter Meetup is an innovative platform designed to enhance the gaming experience for players of the popular mobile game "Monster Hunter Now". By leveraging blockchain technology, specifically Sui's ZKLogin and Closed-loop Token systems, Hunter Meetup provides a secure and private way for gamers to connect, organize, and participate in in-game events.

## Features

### Secure Login with ZKLogin

- Utilize ZKLogin for secure and private authentication.
- Users can log in using their Google Mail accounts without compromising personal information.

### Room Creation and Management

- Players can create rooms specifying the time, location, number of participants, character information, weapon levels, etc.
- Other players can browse and join these rooms based on their preferences and game objectives.

### Closed-loop Token Rewards

- Participants completing events or challenges in-game are rewarded with Hunter Meetup's exclusive Closed-loop Tokens.
- These tokens can be used within the platform for various services or to claim special rewards.

### Social and Collaboration Hub

- A dedicated space for players to meet, plan strategies, and form teams for in-game events.
- Enhances the community aspect of "Monster Hunter Now".

## Getting Started

To start using Hunter Meetup, follow these simple steps:

1. **Clone the repository:**

```shell
git clone https://github.com/yourusername/HunterMeetup.git
```

2. **Navigate to the project directory:**

```shell
cd HunterMeetup
```

3. **Install the dependencies:**

```shell
yarn install
```

4. **Create a `.env` file in the root directory and add the following:**

```shell
cp .env.example .env
```

setting following environment variables:

```shell
TIDB_USER=
TIDB_PASSWORD=
TIDB_HOST=
TIDB_PORT=
TIDB_DB_NAME=
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000/
```

5. **Run the database migrations:**

```shell
yarn prisma:db
yarn prisma:deploy
yarn prisma:generate
```

6. **Start the development server:**

```shell
yarn dev
```

## Contributing

Contributions to Hunter Meetup are welcome. Please read our contributing guidelines before submitting pull requests.

## License

## Contact

For any queries or support, please reach out to [MorrisLin](aka611511@gmail.com).

## Acknowledgements

- Monster Hunter Now Developers
- Sui Network
- Contributors and Supporters of Hunter Meetup
