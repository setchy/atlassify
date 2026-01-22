import { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, Inline, xcss } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import { useAppContext } from '../../hooks/useAppContext';

const gridStyles = xcss({
  width: '100%',
});

const closeContainerStyles = xcss({
  gridArea: 'close',
});

const titleContainerStyles = xcss({
  gridArea: 'title',
});

export const SettingsReset: FC = () => {
  const { t } = useTranslation();
  const { resetSettings } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <Inline alignInline="center">
      <Button
        appearance="danger"
        aria-haspopup="dialog"
        onClick={openModal}
        testId="settings-reset-defaults"
      >
        {t('settings.reset.title')}
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <Grid
                gap="space.200"
                templateAreas={['title close']}
                xcss={gridStyles}
              >
                <Flex justifyContent="end" xcss={closeContainerStyles}>
                  <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label={t('common.close')}
                    onClick={closeModal}
                    testId="settings-reset-close"
                  />
                </Flex>
                <Flex justifyContent="start" xcss={titleContainerStyles}>
                  <ModalTitle appearance="danger">
                    {t('settings.reset.title')}
                  </ModalTitle>
                </Flex>
              </Grid>
            </ModalHeader>
            <ModalBody>
              <p>
                {t('settings.reset.confirm', { appName: APPLICATION.NAME })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={() => closeModal()}
                testId="settings-reset-cancel"
              >
                {t('common.cancel')}
              </Button>
              <Button
                appearance="danger"
                onClick={() => {
                  resetSettings();
                  closeModal();
                }}
                testId="settings-reset-confirm"
              >
                {t('common.reset')}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Inline>
  );
};
