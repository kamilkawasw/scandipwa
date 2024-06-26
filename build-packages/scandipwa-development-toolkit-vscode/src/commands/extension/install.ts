import { installExtension } from '@scandipwa/scandipwa-development-toolkit-core';

import { ActionType } from '../../types';
import logger from '../../util/logger';
import { getResourceName } from '../common/options';

const extensionCreator = async () => {
    const resourceName = await getResourceName('extension', ActionType.Install);

    if (resourceName === '') {
        logger.error('Extension\'s name cannot be empty!');
    }

    if (!resourceName) {
        return;
    }

    installExtension(
        resourceName,
        '0.0.0',
        false,
        true,
        process.cwd(),
        logger,
    );
};

export default extensionCreator;
