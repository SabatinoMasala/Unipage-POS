import Route from 'route-parser';

const routes = [
    {
        //route: new Route('/production-proposal/:proposal(?printer=:printer)'),
        // route: new Route('myos-print://production-proposal/:proposal'),
        // callback(value, $router) {
        //     $router.push({
        //         name: 'pp-detail',
        //         params: {
        //             proposal_id: value.proposal
        //         }
        //     })
        // }
    }

];

const deeplink = {
    matchIfNeeded(url, $router) {
        if (url !== false) {
            return this.match(url, $router)
        }
        return false;
    },
    match(url, $router) {
        let matches = routes.map((tuple) => {
            if (tuple.route.match(url)) {
                return tuple
            }
            return false;
        }).filter((match) => {
            return match !== false;
        });
        if (matches.length > 0) {
            let firstMatch = matches[0];
            firstMatch.callback( firstMatch.route.match(url), $router );
            return true;
        }
        return false;
    }
};

export default deeplink;