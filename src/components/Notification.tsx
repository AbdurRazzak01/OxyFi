import { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import useNotificationStore from '../stores/useNotificationStore'
import { useConnection } from '@solana/wallet-adapter-react';
import { getExplorerUrl } from '../utils/explorer'
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore(
    (s) => s
  )

  const reversedNotifications = [...notifications].reverse()

  return (
    <div
      className={`z-50 fixed inset-x-4 top-4 md:inset-x-auto md:top-4 md:right-4 md:left-auto flex flex-col items-end pointer-events-none max-w-sm space-y-3`}
    >
      {reversedNotifications.map((n, idx) => (
        <Notification
          key={`${n.message}${idx}`}
          type={n.type}
          message={n.message}
          description={n.description}
          txid={n.txid}
          onHide={() => {
            setNotificationStore((state: any) => {
              const reversedIndex = reversedNotifications.length - 1 - idx;
              state.notifications = [
                ...notifications.slice(0, reversedIndex),
                ...notifications.slice(reversedIndex + 1),
              ];
            });
          }}
        />
      ))}
    </div>
  );
}

const Notification = ({ type, message, description, txid, onHide }) => {
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();

  // TODO: we dont have access to the network or endpoint here.. 
  // getExplorerUrl(connection., txid, 'tx')
  // Either a provider, context, and or wallet adapter related pro/contx need updated

  useEffect(() => {
    const id = setTimeout(() => {
      onHide()
    }, 8000);

    return () => {
      clearInterval(id);
    };
  }, [onHide]);

  return (
    <div
      className={`w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 pointer-events-auto ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 animate-slide-down`}
    >
      <div className={`p-4 rounded-lg ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
          : type === 'error' 
          ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
      }`}>
        <div className={`flex items-start`}>
          <div className={`flex-shrink-0`}>
            {type === 'success' ? (
              <CheckCircleIcon className={`h-6 w-6 text-green-500 dark:text-green-400`} />
            ) : null}
            {type === 'info' && <InformationCircleIcon className={`h-6 w-6 text-blue-500 dark:text-blue-400`} />}
            {type === 'error' && (
              <XCircleIcon className={`h-6 w-6 text-red-500 dark:text-red-400`} />
            )}
          </div>
          <div className={`ml-3 w-0 flex-1`}>
            <div className={`font-semibold text-gray-900 dark:text-white text-sm`}>{message}</div>
            {description ? (
              <p className={`mt-1 text-sm text-gray-600 dark:text-gray-300`}>{description}</p>
            ) : null}
            {txid ? (
              <div className="flex flex-row mt-2">
                <a
                  href={'https://explorer.solana.com/tx/' + txid + `?cluster=${networkConfiguration}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 hover:scale-105 transform"
                >
                  <svg className="flex-shrink-0 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  <span className="truncate">
                    {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
                  </span>
                </a>
              </div>
            ) : null}
          </div>
          <div className={`ml-4 flex-shrink-0 flex`}>
            <button
              onClick={() => onHide()}
              className={`bg-white dark:bg-gray-700 rounded-md inline-flex text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 hover:scale-110 p-1`}
            >
              <span className={`sr-only`}>Close</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationList
