#![cfg(feature = "runtime-benchmarks")]


use frame_benchmarking::v2::*;
// use crate::mock::*;
use super::*;
use crate::Pallet as PalletSurvey;
// use mock::*;
// use crate::mock::RuntimeOrigin;
// use crate::{Config,Call};
use frame_system::RawOrigin;
use frame_support::traits::fungible;
// use crate::Pallet;


#[benchmarks]
mod benchmarks {
	use super::*;

	#[benchmark]
	fn create_survey() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit = 1000u16.into();
		#[extrinsic_call]
		_(
            RawOrigin::Signed(survey_owner.clone()),
            survey_id,
            survey_owner.clone(),
            participants_limit
        );
	}

	#[benchmark]
	fn fund_survey() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 1000u16.into();
		let _ = PalletSurvey::<T>::create_survey(
			RawOrigin::Signed(survey_owner.clone()).into(),
			survey_id,
			survey_owner.clone(),
			participants_limit
		);	
		let fund_amount = 10000u16.into();
		let _ = <<T as Config>::NativeBalance as fungible::Mutate<AccountId<T>>>::mint_into(&survey_owner, 1000000000u32.into());

		#[extrinsic_call]
		_(
			RawOrigin::Signed(survey_owner),
			survey_id,
			fund_amount
		)
	}	


	#[benchmark]
	fn create_and_fund_survey() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 1000u16.into();

		let _ = <<T as Config>::NativeBalance as fungible::Mutate<AccountId<T>>>::mint_into(&survey_owner, 1000000000u32.into());
		let fund_amount = 10000u16.into();

		#[extrinsic_call]
		_(
			RawOrigin::Signed(survey_owner.clone()),
			survey_id,
			survey_owner.clone(),
			participants_limit,
			fund_amount
		)
	}

	#[benchmark]
	fn register_participant() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 1000u16.into();

		let _ = <<T as Config>::NativeBalance as fungible::Mutate<AccountId<T>>>::mint_into(&survey_owner, 1000000000u32.into());
		let fund_amount: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 10000u16.into();
		let _ = PalletSurvey::<T>::create_and_fund_survey(
			RawOrigin::Signed(survey_owner.clone()).into(),
			survey_id,
			survey_owner.clone(),
			participants_limit,
			fund_amount
		);
		let participant_id : T::AccountId = account("Participant", 0, 0);
		#[extrinsic_call]
		_(
			RawOrigin::Signed(survey_owner.clone()),
			survey_id,
			participant_id
		)
	}

	#[benchmark]
	fn reward_participant() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 1000u16.into();

		let _ = <<T as Config>::NativeBalance as fungible::Mutate<AccountId<T>>>::mint_into(&survey_owner, 1000000000u32.into());
		let fund_amount: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 10000u16.into();
		let _ = PalletSurvey::<T>::create_and_fund_survey(
			RawOrigin::Signed(survey_owner.clone()).into(),
			survey_id,
			survey_owner.clone(),
			participants_limit,
			fund_amount
		);
		let participant_id : T::AccountId = account("Participant", 0, 0);
		let _ = PalletSurvey::<T>::register_participant(
			RawOrigin::Signed(survey_owner.clone()).into(),
			survey_id,
			participant_id.clone()
		);

		#[extrinsic_call]
		_(
			RawOrigin::Signed(survey_owner.clone()),
			survey_id,
			participant_id
		)
	}

	#[benchmark]
	fn set_survey_status() {
		let survey_id = 0;
		let survey_owner: T::AccountId = whitelisted_caller();
		let participants_limit: <<T as Config>::NativeBalance as fungible::Inspect<AccountId<T>>>::Balance = 1000u16.into();
		let _ = PalletSurvey::<T>::create_survey(
			RawOrigin::Signed(survey_owner.clone()).into(),
			survey_id,
			survey_owner.clone(),
			participants_limit
		);	
		let new_status = Status::Paused;

		#[extrinsic_call]
		_(
			RawOrigin::Signed(survey_owner),
			survey_id,
			new_status
		)
	}	



	impl_benchmark_test_suite!(
		PalletSurvey,
		crate::mock::new_test_ext(),
		crate::mock::Test,
	);
}