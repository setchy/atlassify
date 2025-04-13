import { type FC, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { IconButton } from '@atlaskit/button/new';
import CloseIcon from '@atlaskit/icon/core/close';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, Inline, xcss } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';
import { AppContext } from '../../context/App';

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
  const { resetSettings } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <Inline alignInline="center">
      <Button
        aria-haspopup="dialog"
        appearance="danger"
        onClick={openModal}
        testId="settings-reset-defaults"
      >
        {t('settings.reset_title')}
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
                <Flex xcss={closeContainerStyles} justifyContent="end">
                  <IconButton
                    appearance="subtle"
                    icon={CloseIcon}
                    label={t('common.close')}
                    onClick={closeModal}
                    testId="settings-reset-close"
                  />
                </Flex>
                <Flex xcss={titleContainerStyles} justifyContent="start">
                  <ModalTitle appearance="danger">
                    {t('settings.reset_title')}
                  </ModalTitle>
                </Flex>
              </Grid>
            </ModalHeader>
            <ModalBody>
              <p>
                {t('settings.reset_confirm', { appName: APPLICATION.NAME })}
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
