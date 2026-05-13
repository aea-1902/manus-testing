import React from 'react';
import Image from 'next/image';
import PaddleButton from './Paddle/PaddleButton';
import styles from '../styles/styling/Premium.module.css';
import { MemberTypeEnum } from '../enum/MemberType';

const PricingCard = ({ 
    title, 
    subtitle, 
    price, 
    perks, 
    type, // 'credits' or 'subscription'
    userBilling, 
    newUserData, 
    accountUpdated,
    subscriptionStatus,
    paymentGateway,
    SubscriptionStatusEnum,
    GateWayTypeEnum,
    // For credits type
    creditPlans,
    selectedCreditPlan,
    setSelectedCreditPlan,
    setPlanId,
    setPaddleProduct,
    paddleProduct,
    planId,
    setCreditPaddleProduct,
    // For subscription type
    proPlans,
    selectedProPlan,
    setSelectedProPlan,
    CreditPlansDropdown,
    ProPlansDropdown,
    memberType,
    hasShopifyWebshop
}) => {
    const hasShopifySubscription = paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY && subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE;
    const isDisabled = (hasShopifyWebshop || hasShopifySubscription) 
        ? true 
        : false;

    const getMemberType = () => {
        return userBilling.credit.membershipType;
    }

    const renderDropdown = () => {
        if (type === 'credits') {
            return (
                <CreditPlansDropdown 
                    creditPlans={creditPlans} 
                    selectedPlan={selectedCreditPlan} 
                    setSelectedPlan={setSelectedCreditPlan}
                    setPlanId={setPlanId}
                    setPaddleProduct={setPaddleProduct}
                    memberType={getMemberType()}
                    setCreditPaddleProduct={setCreditPaddleProduct}
                    disabled={isDisabled}
                />
            );
        } else if (type === 'subscription') {
            return (
                <ProPlansDropdown 
                    proPlans={proPlans} 
                    selectedPlan={selectedProPlan} 
                    setSelectedPlan={setSelectedProPlan}
                    setPlanId={setPlanId}
                    memberType={getMemberType()}
                    setPaddleProduct={setPaddleProduct}
                    disabled={isDisabled}
                />
            );
        }
        return null;
    };

    const getPaddleButtonProps = () => {
        if (type === 'credits') {
            const selectedPlan = creditPlans?.find(x => x.textDisplayCredits === selectedCreditPlan);
            return {
                type: "credits",
                isAnnual: false,
                productId: paddleProduct,
                planId: planId, // This is now creditPlanId
                credits: selectedPlan?.credits || 0
            };
        } else if (type === 'subscription') {
            const isAnnual = selectedProPlan?.toLowerCase().includes('annual') || false;
            const credits = isAnnual 
                ? proPlans?.annual?.credits || 0 
                : proPlans?.monthly?.credits || 0;
            return {
                type: "subscription",
                isAnnual: isAnnual,
                productId: paddleProduct,
                planId: planId, // This is now subscriptionPlanId
                credits: credits
            };
        }
        return {
            type: "credits",
            isAnnual: false,
            productId: "",
            planId: "",
            credits: 0
        };
    };
    const paddleProps = getPaddleButtonProps();
    
    return (
        <>
        {getMemberType() == MemberTypeEnum.FREETRIAL &&
        <> 
            <div className={`${styles.pricing} mb-30`}>
                <p className={styles.pricingTitle}>{title}</p>
                <p className={styles.pricingSubTitle}>{subtitle}</p>
                <div style={{height: 91, marginBottom: 20}}>
                    <p className={styles.pricingPrice}>{price}</p>
                    <div className={styles.pricingDropdown}>
                        {renderDropdown()}
                    </div>
                </div>
                
                {perks.map((perk, index) => (
                    <div key={index} className={`${styles.pricingPerksRow} ${index === perks.length - 1 ? 'mb-0' : ''}`}>
                        <Image 
                            src='/images/ic_perks_check.svg' 
                            width={15} 
                            height={11} 
                            alt='check' 
                        />
                        <span>{perk}</span>
                    </div>
                ))}
                <div style={{marginTop: 'auto', paddingTop: '31px'}}>
                    <PaddleButton 
                        userData={userBilling} 
                        newUserData={newUserData}  
                        type={paddleProps.type}
                        isAnnual={paddleProps.isAnnual}
                        productId={paddleProps.productId}
                        planId={paddleProps.planId}
                        credits={paddleProps.credits}
                        accountUpdated={accountUpdated} 
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </>
        }
        {getMemberType() == MemberTypeEnum.STARTER &&
        <>
        <div className={`${styles.starterPricing} mb-30`}>
            <div className={`d-flex justify-content-between`}>
                <div style={{width: 177}}>
                    <p className={styles.starterPricingTitle}>{title}</p>
                    <p className={styles.starterPricingSubTitle}>{subtitle}</p>
                </div>
                <div>
                    <div className={styles.pricingDropdown}>
                        {renderDropdown()}
                    </div>
                </div>
            </div>
                
                {perks.map((perk, index) => (
                    <div key={index} className={`${styles.starterPricingPerksRow} ${index === perks.length - 1 ? 'mb-0' : ''}`}>
                        <Image 
                            src='/images/ic_perks_check.svg' 
                            width={15} 
                            height={11} 
                            alt='check' 
                        />
                        <span>{perk}</span>
                    </div>
                ))}
                <div style={{display: 'flex',marginTop: 'auto', paddingTop: '16px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', paddingTop: '4.5px', margin: 'auto 0'}}>
                        <p className={styles.starterPricingPrice}>{price}</p>
                        <p className={styles.starterPricingDisclaimer}>excl. of applicable tax</p>
                    </div>
                    <span style={{marginLeft: 'auto'}}>
                        <PaddleButton 
                            userData={userBilling} 
                            newUserData={newUserData}  
                            type={paddleProps.type}
                            isAnnual={paddleProps.isAnnual}
                            productId={paddleProps.productId}
                            planId={paddleProps.planId}
                            credits={paddleProps.credits}
                            accountUpdated={accountUpdated} 
                            disabled={isDisabled}
                        />
                    </span>
                </div>
            </div>
        </>
        }
        {getMemberType() == MemberTypeEnum.PROFESSIONAL &&
        <></>
        }
        {getMemberType() == MemberTypeEnum.ENTERPRISE &&
        <></>
        }
        </>
    );
};

export default PricingCard; 