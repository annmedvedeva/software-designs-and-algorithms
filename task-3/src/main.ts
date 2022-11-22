import { Either, fromPromise, ap, right, getOrElse, flatten, left } from "./fp/either";
import { matcher, pipe, constant } from "./fp/utils";
import { fetchClient, fetchExecutor } from "./fetching";
import { ClientUser, ExecutorUser } from "./types";
import { fromNullable, Maybe, fold, none, some } from "./fp/maybe";
import { distance } from "./utils";
import { fromCompare, Ord, ordNumber } from "./fp/ord";
import { sort, map } from "./fp/array";
type Response<R> = Promise<Either<string, R>>

const getExecutor = (): Response<ExecutorUser> => fromPromise(fetchExecutor())
const getClients = (): Response<Array<ClientUser>> => fromPromise(fetchClient().then((users) => users.map((user): ClientUser => Object.assign({}, user, { demands: fromNullable(user.demands) }))))

export enum SortBy {
    distance = 'distance',
    reward = 'reward',
}

const eqStr = (str1: string) => (str2: string) => str1 === str2

const fromArray = <A>(arr: Array<A>): Maybe<Array<A>> => arr.length === 0 ? none : some(arr)

const stringifyClient = (executor: ExecutorUser) => (client: ClientUser) => `\
name: ${client.name}, \
distance: ${distance(executor.position, client.position)}, \
reward: ${client.reward}`

export const show = (sortBy: SortBy) => (clients: Array<ClientUser>) => (executor: ExecutorUser): Either<string, string> => {
    const availableClients = clients.filter(
        client => pipe(
            client.demands,
            fold(
                () => true,
                (demands) => demands.every(demand => executor.possibilities.includes(demand))
            ),
        )
    )

    return pipe(
        fromArray(availableClients),
        fold(
            () => left('This executor cannot meet the demands of any client!'),
            (availableClients) => {
                const headerString = availableClients.length === clients.length
                    ? 'This executor meets all demands of all clients!'
                    : `This executor meets the demands of only ${availableClients.length} out of ${clients.length} clients`;

                const byDistanceToExecutor = fromCompare<ClientUser>((client1, client2) => (
                    ordNumber.compare(
                        distance(executor.position, client1.position), distance(executor.position, client2.position)
                    )
                ))
                const byReward = fromCompare<ClientUser>((client1, client2) => ordNumber.compare(client2.reward, client1.reward))

                const [comparator, sortByTitle] = matcher<SortBy, [Ord<ClientUser>, string]>(
                    [eqStr(SortBy.distance), constant([byDistanceToExecutor, 'distance to executor'])],
                    [eqStr(SortBy.reward), constant([byReward, 'highest reward'])]
                )(sortBy)

                return right(
`${headerString}

Available clients sorted by ${sortByTitle}:
${pipe(
    availableClients,
    sort(comparator),
    map(stringifyClient(executor))
).join('\n')}`
                )
            }
        )
    )
}

export const main = (sortBy: SortBy): Promise<string> => (
    Promise
        .all([getClients(), getExecutor()]) // Fetch clients and executor
        .then(([clients, executor]) => (
            pipe(
                /**
                 * Since show takes two parameters, the value of which is inside Either
                 * clients is Either<string, Array<Client>>, executor is Either<string, Executor>. How to pass only Array<Client> and Executor to the show?
                 * Either is applicative type class, which is means that we can apply each parameter by one
                 */
                right(show(sortBy)), // Firstly, we need to lift our function to the Either
                ap(clients), // Apply first parameter
                ap(executor), // Apply second parameter
                flatten, // show at the end returns Either as well, so the result would be Either<string, Either<string, string>>. We need to flatten the result
                getOrElse((err) => err) // In case of any left (error) value, it would be stopped and show error. So, if clients or executor is left, the show would not be called, but onLeft in getOrElse would be called
            )
        ))
)
